"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

interface PasskeyLoginProps {
  onSuccess: (response: any) => void;
  onError: (error: Error) => void;
  isRegistration?: boolean;
}

export function PasskeyLogin({ onSuccess, onError, isRegistration = false }: PasskeyLoginProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if WebAuthn is supported
    if (typeof window !== "undefined" && window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => setIsSupported(available))
        .catch(() => setIsSupported(false));
    } else {
      setIsSupported(false);
    }
  }, []);

  const handlePasskeyAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch challenge from server
      const challengeEndpoint = isRegistration ? "/api/auth/passkey/register" : "/api/auth/passkey/authenticate";
      const challengeResponse = await fetch(challengeEndpoint);
      const options = await challengeResponse.json();

      // Start registration or authentication
      const authResponse = await (isRegistration ? startRegistration(options) : startAuthentication(options));

      // Verify with server
      const verifyEndpoint = isRegistration ? "/api/auth/passkey/register/verify" : "/api/auth/passkey/authenticate/verify";
      const verifyResponse = await fetch(verifyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important for security
        body: JSON.stringify(authResponse),
      });

      if (!verifyResponse.ok) {
        throw new Error("Failed to verify passkey");
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
    return <div>Checking passkey support...</div>;
  }

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Passkeys are not supported in your browser. Please use a modern browser or try another login method.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isRegistration ? "Set Up Passkey" : "Sign In with Passkey"}
      </h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={handlePasskeyAuth}
        className="w-full"
        variant="default"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : (isRegistration ? "Register Passkey" : "Use Passkey")}
      </Button>
    </Card>
  );
}
