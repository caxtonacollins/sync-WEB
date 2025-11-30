"use client";

import React, { useState, useEffect } from "react";
import { QrCodeIcon, CameraIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCode } from "qrcode.react";
import dynamic from "next/dynamic";
import merchantPaymentSystem from "@/lib/merchant-payment";
const QRScanner = dynamic(() => import("./QRScanner").then((m) => m.default), {
  ssr: false,
});

interface QRCodeData {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  description: string;
  expiresAt: string;
  qrCodeData: string;
  isActive: boolean;
  createdAt: string;
}

interface QRCodeGeneratorProps {
  merchantId: string;
  onQRGenerated?: (qrData: QRCodeData) => void;
}

export default function QRCodeGenerator({
  merchantId,
  onQRGenerated,
}: QRCodeGeneratorProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [description, setDescription] = useState("");
  const [expiresIn, setExpiresIn] = useState(30);
  const [generatedQR, setGeneratedQR] = useState<QRCodeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const currencyOptions = ["NGN", "USD", "EUR", "GBP", "STRK", "USDC"];

  const handleGenerateQR = async () => {
    if (!amount || !description) {
      setError("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const qrData = await merchantPaymentSystem.generatePaymentQR(
        merchantId,
        parseFloat(amount),
        currency,
        description,
        expiresIn
      );

      setGeneratedQR(qrData);
      onQRGenerated?.(qrData);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to generate QR code"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScanQR = () => {
    setShowScanner(true);
  };

  const [showScanner, setShowScanner] = useState(false);

  const copyQRData = () => {
    if (generatedQR) {
      navigator.clipboard.writeText(generatedQR.qrCodeData);
      alert("QR Code data copied to clipboard!");
    }
  };

  const formatExpiryTime = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins <= 0) return "Expired";
    if (diffMins < 60) return `${diffMins} minutes`;

    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hours`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <QrCodeIcon className="h-6 w-6 mr-2 text-purple-400" />
            Generate Payment QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount" className="text-gray-300">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency" className="text-gray-300">
                Currency
              </Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                {currencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Payment description"
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="expiresIn" className="text-gray-300">
              Expires in (minutes)
            </Label>
            <Input
              id="expiresIn"
              type="number"
              value={expiresIn}
              onChange={(e) => setExpiresIn(parseInt(e.target.value))}
              min="1"
              max="1440"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <Button
            onClick={handleGenerateQR}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? "Generating..." : "Generate QR Code"}
          </Button>
        </CardContent>
      </Card>

      {generatedQR && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Generated QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg flex justify-center">
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  {/* render the actual QR code */}
                  {generatedQR ? (
                    <QRCode
                      value={generatedQR.qrCodeData}
                      size={180}
                      bgColor="#ffffff"
                      fgColor="#111827"
                    />
                  ) : (
                    <QrCodeIcon className="h-24 w-24 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  QR Code would be displayed here
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white font-semibold">
                  {amount} {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Description:</span>
                <span className="text-white">{description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    generatedQR.isActive
                      ? "bg-green-900 text-green-400"
                      : "bg-red-900 text-red-400"
                  }`}
                >
                  {generatedQR.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expires:</span>
                <span className="text-white">
                  {formatExpiryTime(generatedQR.expiresAt)}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={copyQRData}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Copy QR Data
              </Button>
              <Button
                onClick={handleScanQR}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <CameraIcon className="h-4 w-4 mr-2" />
                Scan QR
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scanner modal / drawer */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl bg-gray-900 rounded p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Scan QR to Pay</h3>
              <Button variant="ghost" onClick={() => setShowScanner(false)}>
                Close
              </Button>
            </div>
            <QRScanner
              onDetected={(result) => {
                setShowScanner(false);
                try {
                  if (result.parsed) {
                    // If we get parsed payload, we can show it or navigate to a payment confirm flow
                    const data = result.parsed as any;
                    const qrData: QRCodeData = {
                      id: data.id ?? "scanned",
                      merchantId: data.merchantId ?? "",
                      amount: data.amount ?? 0,
                      currency: data.currency ?? "NGN",
                      description: data.description ?? "",
                      expiresAt: data.expiresAt ?? new Date().toISOString(),
                      qrCodeData: result.raw,
                      isActive: true,
                      createdAt: data.createdAt ?? new Date().toISOString(),
                    };
                    // hand off to parent if needed
                    onQRGenerated?.(qrData);
                    alert(
                      `Scanned QR for ${qrData.amount} ${qrData.currency} — merchant ${qrData.merchantId}`
                    );
                  } else {
                    alert(`Scanned: ${result.raw}`);
                  }
                } catch (e) {
                  console.error(e);
                }
              }}
              onClose={() => setShowScanner(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
