"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginWithPasskey, registerPasskey } from "@/lib/passkey";
import { api } from "@/lib/api-client";

interface BiometricAuthProps {
  onSuccess: (response: any) => void;
  onError: (error: Error) => void;
  isRegistration?: boolean;
  authToken?: string;
  email?: string;
}

export function BiometricAuth({ onSuccess, onError, isRegistration = false, authToken, email }: BiometricAuthProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if platform authenticator is available (biometric support)
    if (typeof window !== "undefined" && window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => setIsSupported(available))
        .catch(() => setIsSupported(false));
    } else {
      setIsSupported(false);
    }
  }, []);

  const handleBiometricAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isRegistration) {
        if (!authToken) {
          throw new Error('Auth token is required for registration');
        }
        
        if (!email) {
          throw new Error('Email is required for biometric registration');
        }

        // First, fetch the registration options
        const optionsRes = await api.get(`/auth/passkey/register-options`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!optionsRes.data) {
          throw new Error('Failed to get registration options');
        }

        const options = optionsRes.data;

        // Then call registerPasskey with both token and options
        const response = await registerPasskey(authToken, options);
        if (response.success) {
          onSuccess(response);
        } else {
          throw new Error(response.error || 'Biometric registration failed');
        }
      } else {
        if (!email) {
          throw new Error('Email is required for passkey login');
        }
        const response = await loginWithPasskey(email);
        if (response.success) {
          onSuccess(response.data);
        } else {
          throw new Error(response.error || 'Biometric authentication failed');
        }
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSupported === null) {
    return <div>Checking biometric support...</div>;
  }

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Biometric authentication is not supported on this device. Please use another authentication method.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isRegistration ? "Set Up Biometric Login" : "Sign In with Biometrics"}
      </h2>
      <p className="mb-4">
        {isRegistration
          ? "Use your device's biometric authentication (fingerprint, face recognition) for secure access."
          : "Verify your identity using biometric authentication."}
      </p>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={handleBiometricAuth}
        className="w-full"
        variant="default"
        disabled={isLoading}
      >
        {isLoading
          ? "Processing..."
          : (isRegistration ? "Set Up Biometric Login" : "Use Biometric Login")}
      </Button>
    </Card>
  );
}
