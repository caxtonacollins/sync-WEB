"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

interface BiometricAuthProps {
  onSuccess: (response: any) => void;
  onError: (error: Error) => void;
  isRegistration?: boolean;
}

export function BiometricAuth({ onSuccess, onError, isRegistration = false }: BiometricAuthProps) {
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

      // Fetch challenge from server
      const challengeEndpoint = isRegistration ? "/api/auth/biometric/register" : "/api/auth/biometric/authenticate";
      const challengeResponse = await fetch(challengeEndpoint, {
        credentials: "include",
      });

      if (!challengeResponse.ok) {
        throw new Error("Failed to get challenge");
      }

      const options = await challengeResponse.json();

      // Ensure the authenticator prefers platform (biometric) verification
      options.authenticatorSelection = {
        ...options.authenticatorSelection,
        authenticatorAttachment: "platform",
        userVerification: "required",
      };

      // Start biometric registration or authentication
      const authResponse = await (isRegistration ? startRegistration(options) : startAuthentication(options));

      // Verify with server
      const verifyEndpoint = isRegistration ? "/api/auth/biometric/register/verify" : "/api/auth/biometric/authenticate/verify";
      const verifyResponse = await fetch(verifyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(authResponse),
      });

      if (!verifyResponse.ok) {
        throw new Error("Failed to verify biometric authentication");
      }

      const result = await verifyResponse.json();
      onSuccess(result);
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
