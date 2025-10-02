"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";

interface MfaSetupProps {
  onSuccess: (response: any) => void;
  onError: (error: Error) => void;
  onCancel: () => void;
}

export function MfaSetup({ onSuccess, onError, onCancel }: MfaSetupProps) {
  const [step, setStep] = useState<"init" | "verify">("init");
  const [secret, setSecret] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initializeMfa = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/mfa/initialize", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to initialize MFA");
      }

      const { secret, qrCode, backupCodes } = await response.json();
      setSecret(secret);
      setQrCode(qrCode);
      setBackupCodes(backupCodes);
      setStep("verify");
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndEnableMfa = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: verificationCode, secret }),
      });

      if (!response.ok) {
        throw new Error("Invalid verification code");
      }

      const result = await response.json();
      onSuccess({ ...result, backupCodes });
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "init") {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Set up Two-Factor Authentication</h2>
        <p className="mb-4">
          Enhance your account security by setting up two-factor authentication using an authenticator app.
        </p>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-x-3">
          <Button onClick={initializeMfa} disabled={isLoading}>
            {isLoading ? "Setting up..." : "Begin Setup"}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Verify Setup</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-6">
        <div className="text-center">
          <QRCodeSVG value={qrCode} size={200} className="mx-auto mb-4" />
          <p className="text-sm text-gray-500">
            Scan this QR code with your authenticator app
          </p>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Manual entry code:</p>
          <code className="bg-gray-100 p-2 rounded block text-center select-all">
            {secret}
          </code>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Enter verification code:
          </label>
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="mb-4"
            maxLength={6}
          />
        </div>

        <div className="space-x-3">
          <Button onClick={verifyAndEnableMfa} disabled={isLoading || verificationCode.length !== 6}>
            {isLoading ? "Verifying..." : "Verify and Enable"}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium mb-2">Backup Codes:</p>
          <Alert>
            <AlertDescription>
              <p className="mb-2">Save these backup codes in a secure place. You'll need them if you lose access to your authenticator app:</p>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <code key={index} className="bg-gray-100 p-1 rounded text-center select-all">
                    {code}
                  </code>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </Card>
  );
}
