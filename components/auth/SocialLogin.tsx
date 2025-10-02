"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SocialLoginProps {
  onSuccess: (response: any) => void;
  onError: (error: Error) => void;
  providers: Array<"google" | "apple" | "github">;
}

export function SocialLogin({ onSuccess, onError, providers }: SocialLoginProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(provider);
      setError(null);

      // Initialize OAuth flow
      const response = await fetch(`/api/auth/${provider}/authorize`);
      const { url } = await response.json();

      // Store current URL for redirect back after auth
      sessionStorage.setItem("authRedirect", window.location.href);

      // Redirect to provider's OAuth page
      window.location.href = url;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError(error);
    } finally {
      setIsLoading(null);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return "🔍";
      case "apple":
        return "🍎";
      case "github":
        return "🐱";
      default:
        return "📱";
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sign in with</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-3">
        {providers.map((provider) => (
          <Button
            key={provider}
            onClick={() => handleSocialLogin(provider)}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
            disabled={!!isLoading}
          >
            <span>{getProviderIcon(provider)}</span>
            <span className="capitalize">
              {isLoading === provider ? "Connecting..." : provider}
            </span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
