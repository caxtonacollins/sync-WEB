"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// react-webcam is already a dependency; import dynamically to avoid SSR problems
// cast to any to avoid type mismatch issues with the library's default export
const Webcam = dynamic(
  () => import("react-webcam").then((m: any) => m.default),
  { ssr: false }
) as any;

interface QRScanResult {
  raw: string;
  parsed?: Record<string, any>;
}

interface QRScannerProps {
  onDetected: (result: QRScanResult) => void;
  onClose?: () => void;
}

export default function QRScanner({ onDetected, onClose }: QRScannerProps) {
  const webcamRef = useRef<any>(null);
  const detectorRef = useRef<any>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [pasteValue, setPasteValue] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).BarcodeDetector) {
      setSupported(true);
      try {
        detectorRef.current = new (window as any).BarcodeDetector({
          formats: ["qr_code"],
        });
      } catch (e) {
        console.warn("BarcodeDetector init failed", e);
        setSupported(false);
      }
    } else {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    let raf = 0;
    let stopped = false;

    async function captureLoop() {
      if (stopped) return;
      if (!detectorRef.current || !webcamRef.current) {
        raf = requestAnimationFrame(captureLoop);
        return;
      }

      try {
        const video = webcamRef.current?.video as HTMLVideoElement | undefined;
        if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
          const bitmap = await createImageBitmap(video);
          const results = await detectorRef.current.detect(bitmap);
          if (results && results.length > 0) {
            const text = results[0].rawValue;
            let parsed;
            try {
              parsed = JSON.parse(text);
            } catch (e) {
              parsed = undefined;
            }
            onDetected({ raw: text, parsed });
            stopped = true;
            setScanning(false);
            return;
          }
        }
      } catch (e) {
        // ignore
      }

      raf = requestAnimationFrame(captureLoop);
    }

    if (scanning) captureLoop();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [scanning, onDetected]);

  const startScanning = () => {
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const handlePasteSubmit = () => {
    if (!pasteValue) return;
    let parsed;
    try {
      parsed = JSON.parse(pasteValue);
    } catch (e) {
      parsed = undefined;
    }
    onDetected({ raw: pasteValue, parsed });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Scan QR</h3>
        <p className="text-sm text-gray-400">
          Use your camera to scan a payment QR code, or paste the QR payload.
        </p>
      </div>

      {supported === null ? (
        <div>Checking camera support…</div>
      ) : supported ? (
        <div className="space-y-2">
          <div className="w-full max-w-md bg-black rounded overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              videoConstraints={{ facingMode: "environment" }}
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={startScanning} className="flex-1">
              Start Scanning
            </Button>
            <Button onClick={stopScanning} variant="outline" className="flex-1">
              Stop
            </Button>
            <Button onClick={onClose} variant="ghost">
              Close
            </Button>
          </div>
          <div className="text-sm text-gray-400">
            Status: {scanning ? "Scanning…" : "Idle"}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm text-gray-400">
            Your browser does not support the BarcodeDetector API.
          </div>
          <label className="block">
            <textarea
              rows={4}
              className="w-full p-2 bg-gray-800 text-white rounded"
              value={pasteValue}
              onChange={(e) => setPasteValue(e.target.value)}
              placeholder="Paste QR payload or JSON here (or a payment URL)"
            />
          </label>
          <div className="flex space-x-2">
            <Button onClick={handlePasteSubmit}>Submit</Button>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
