import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { api } from '@/lib/api-client';

export async function registerPasskey(token: string, options: any) {
  try {
    if (!token) {
      throw new Error('No access token found');
    }

    // Start the registration process with the browser
    const attestation = await startRegistration(options);

    // Verify the registration with the server
    const verificationRes = await api.post(`/auth/passkey/register-verify`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      data: attestation,
    });

    const verificationJSON = verificationRes.data;

    if (verificationJSON && verificationJSON.verified) {
      return { success: true };
    } else {
      console.error('Passkey registration failed', {
        status: verificationRes.status,
        statusText: verificationRes.statusText,
        response: verificationJSON
      });
      throw new Error(verificationJSON.message || 'Passkey registration failed');
    }
  } catch (error) {
    console.error('Passkey registration error:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function loginWithPasskey(email: string) {
  try {
    // 1. Get authentication options from the server
    console.log("from login with passkey email", email);

    const optionsRes = await api.get(`/auth/passkey/login-options?email=${encodeURIComponent(email)}`);

    if (!optionsRes.data) {
      throw new Error('Failed to get authentication options');
    }

    const optionsResJson = optionsRes.data;

    // 2. Start the authentication process with the browser
    const assertion = await startAuthentication(optionsResJson.options);

    // 3. Verify the authentication with the server
    const verificationRes = await api.post(`/auth/passkey/login-verify`, {
      userId: optionsResJson.userId,
      assertion,
    });
    if (!verificationRes.data) {
      throw new Error('Passkey verification failed');
    }

    const verificationJSON = verificationRes.data;

    return { success: true, data: verificationJSON };

  } catch (error) {
    console.error('Passkey login error:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
