"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginWithPasskey, registerPasskey } from "@/lib/passkey";

interface PasskeyLoginProps {
  onSuccess: (response: any) => void;
  onError: (error: Error) => void;
  isRegistration?: boolean;
  token?: string;
}

export default function PasskeyLogin({
  onSuccess,
  onError,
  isRegistration = false,
  token
}: PasskeyLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [registrationOptions, setRegistrationOptions] = useState<any>(null);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    // Get the last used email from local storage
    if (typeof window !== 'undefined') {
      const lastEmail = localStorage.getItem('lastEmail') || '';
      setEmail(lastEmail);
    }
  }, []);

  useEffect(() => {
    const checkSupportAndFetchOptions = async () => {
      const supported = typeof window !== 'undefined' && !!window.PublicKeyCredential &&
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setIsSupported(supported);

      if (supported && isRegistration && token) {
        try {
          const optionsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/passkey/register-options`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!optionsRes.ok) throw new Error('Failed to fetch registration options');
          const options = await optionsRes.json();
          setRegistrationOptions(options);
        } catch (err) {
          setError((err as Error).message);
        }
      }
    };

    checkSupportAndFetchOptions();
  }, [isRegistration, token]);

  const handlePasskeyAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let result;
      if (isRegistration) {
        if (!token) throw new Error('Registration token is required');
        if (!registrationOptions) throw new Error('Registration options not loaded yet');
        result = await registerPasskey(token, registrationOptions);
      } else {
        if (!email) {
          throw new Error('No email found. Please sign in with email first.');
        }
        result = await loginWithPasskey(email);
      }

      if (result.success) {
        onSuccess('data' in result ? result.data : { verified: true });
      } else {
        console.error("Passkey operation failed", result);
        throw new Error("Passkey operation failed");
      }
    } catch (err) {
      const errorMsg = (err as Error).message;
      console.error("Passkey operation failed", { success: false, error: errorMsg });
      setError(errorMsg);
      onError(err as Error);
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
      {!isRegistration && email && (
        <div className="text-sm text-gray-600 mb-4">
          Signing in as: <span className="font-medium">{email}</span>
        </div>
      )}
      <Button
        onClick={handlePasskeyAuth}
        className="w-full"
        variant="default"
        disabled={isLoading || (!isRegistration && !email)}
      >
        {isLoading ? "Processing..." : (isRegistration ? "Register Passkey" : `Continue as ${email ? email.split('@')[0] : ''}`)}
      </Button>
    </Card>
  );
}
