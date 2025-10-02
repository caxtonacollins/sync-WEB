"use client";

import { useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QRScannerProps {
  onScan: (data: string) => void;
  onError: (error: Error) => void;
  onCancel: () => void;
}

export function QRScanner({ onScan, onError, onCancel }: QRScannerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // QR scanning logic would go here - you'd need to implement or use a library
  // for QR code detection from video frames
  const handleScan = useCallback(async (imageSrc: string | null) => {
    if (!imageSrc) return;

    try {
      setIsLoading(true);
      setError(null);

      // Here you would implement QR code detection
      // For now, we'll simulate it with a fetch to a hypothetical API
      const response = await fetch("/api/qr/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      });

      if (!response.ok) {
        throw new Error("Failed to decode QR code");
      }

      const { data } = await response.json();
      if (data) {
        onScan(data);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  }, [onScan, onError]);

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
    } catch (err) {
      setHasPermission(false);
      setError("Camera permission denied");
      onError(new Error("Camera permission denied"));
    }
  };

  if (hasPermission === null) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">QR Code Scanner</h2>
        <p className="mb-4">We need permission to use your camera to scan QR codes.</p>
        <Button onClick={requestPermission}>Allow Camera Access</Button>
      </Card>
    );
  }

  if (hasPermission === false) {
    return (
      <Card className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Camera access is required to scan QR codes. Please enable camera access in your browser settings.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="relative">
        <Webcam
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full rounded-lg"
          onUserMedia={() => setHasPermission(true)}
          onUserMediaError={(err) => {
            setError(err.message);
            setHasPermission(false);
          }}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-white">Scanning...</p>
          </div>
        )}
      </div>
      <div className="mt-4 space-x-3">
        <Button
          onClick={() => handleScan(null)}
          disabled={isLoading}
        >
          {isLoading ? "Scanning..." : "Scan"}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </Card>
  );
}
