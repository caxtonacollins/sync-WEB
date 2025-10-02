"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FaceScannerProps {
  onSuccess: (response: any) => void;
  onError: (error: Error) => void;
  isRegistration?: boolean;
}

export function FaceScanner({ onSuccess, onError, isRegistration = false }: FaceScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop video stream when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsScanning(true);
    } catch (err) {
      const error = err as Error;
      setError("Failed to access camera. Please ensure camera permissions are granted.");
      onError(error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const submitFaceScan = async () => {
    if (!capturedImage) return;

    try {
      setError(null);
      
      const endpoint = isRegistration 
        ? "/api/auth/face/register" 
        : "/api/auth/face/authenticate";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ image: capturedImage }),
      });

      if (!response.ok) {
        throw new Error("Face scan verification failed");
      }

      const result = await response.json();
      onSuccess(result);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError(error);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isRegistration ? "Register Face ID" : "Face ID Login"}
      </h2>
      <p className="mb-4 text-gray-600">
        {isRegistration
          ? "Position your face in the frame and capture a clear photo for registration."
          : "Verify your identity using facial recognition."}
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Video/Image Display */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          {!isScanning && !capturedImage && (
            <div className="text-gray-400 text-center p-8">
              <svg
                className="w-24 h-24 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p>Click "Start Camera" to begin</p>
            </div>
          )}

          {isScanning && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Face detection overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-80 border-4 border-blue-500 rounded-full opacity-50"></div>
              </div>
            </>
          )}

          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured face"
              className="w-full h-full object-cover"
            />
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isScanning && !capturedImage && (
            <Button onClick={startCamera} className="flex-1">
              Start Camera
            </Button>
          )}

          {isScanning && (
            <>
              <Button onClick={captureImage} className="flex-1">
                Capture Photo
              </Button>
              <Button onClick={stopCamera} variant="outline" className="flex-1">
                Cancel
              </Button>
            </>
          )}

          {capturedImage && (
            <>
              <Button onClick={submitFaceScan} className="flex-1">
                {isRegistration ? "Register Face" : "Verify Face"}
              </Button>
              <Button onClick={retakePhoto} variant="outline" className="flex-1">
                Retake Photo
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
