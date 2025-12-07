"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import { changePassword as changePasswordApi } from "@/api/routes/user"
import { disable2FA, enable2FA, generate2FA, getSecurityStatus } from "@/api/routes/auth"
import Image from "next/image"
import { registerPasskey } from "@/lib/passkey"

export default function SecuritySettings() {
  const { user, token, fetchUserDetails } = useAuth()
  const { addToast } = useToast()
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loadingPassword, setLoadingPassword] = useState(false)

  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isEnabling2FA, setIsEnabling2FA] = useState(false)
  const [isDisabling2FA, setIsDisabling2FA] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  const [isPasskeyEnabled, setIsPasskeyEnabled] = useState(false);
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);

  useEffect(() => {
    if (user && token) {
      const fetchStatus = async () => {
        try {
          const status = await getSecurityStatus(token);
          setIs2FAEnabled(status.mfaEnabled);
          setIsPasskeyEnabled(status.passkeyEnabled);
        } catch (error) {
          console.error("Failed to fetch security status", error);
        }
      };
      fetchStatus();
    }
  }, [user, token]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !token) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast("New passwords do not match", "error")
      return
    }

    setLoadingPassword(true)
    try {
      await changePasswordApi(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, token)
      addToast("Password updated successfully", "success")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) { 
      const errorMessage = (error as any)?.response?.data?.message || "Failed to update password";
      addToast(errorMessage, "error");
    } finally {
      setLoadingPassword(false)
    }
  }

  const handleEnable2FA = async () => {
    if (!token) return;
    try {
      const data = await generate2FA(token);
      setQrCodeUrl(data.qrCode);
      setShowQRCode(true);
    } catch (error) {
      addToast("Failed to generate 2FA QR code", "error");
    }
  };

  const handleVerifyAndEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsEnabling2FA(true);

    try {
      await enable2FA(verificationCode, token);
      addToast("2FA enabled successfully!", "success");
      await fetchUserDetails(); // Refresh user details
      setIs2FAEnabled(true);
      setShowQRCode(false);
      setVerificationCode("");
    } catch (error) {
      addToast("Failed to enable 2FA. Please check your code.", "error");
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm("Are you sure you want to disable 2FA? This will make your account less secure.")) {
      return;
    }
    if (!token) return;

    setIsDisabling2FA(true);

    try {
      await disable2FA(token);
      addToast("2FA disabled successfully", "success");
      await fetchUserDetails(); // Refresh user details
      setIs2FAEnabled(false);
    } catch (error) {
      addToast("Failed to disable 2FA", "error");
    } finally {
      setIsDisabling2FA(false);
    }
  };

  const handleRegisterPasskey = async () => {
    if (!token) {
      addToast("You need to be logged in to register a passkey", "error");
      return;
    }
    
    setIsRegisteringPasskey(true);
    try {
      const result = await registerPasskey(token);
      if (result.success) {
        addToast("Passkey registered successfully!", "success");
        await fetchUserDetails(); // Refresh user details
        setIsPasskeyEnabled(true);
      } else {
        addToast("Failed to register passkey.", "error");
      }
    } catch (error) {
      console.error("Passkey registration error:", error);
      addToast("An unexpected error occurred during passkey registration.", "error");
    } finally {
      setIsRegisteringPasskey(false);
    }
  };

  return (
    <div className="card space-y-8">
      {/* Change Password Section */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="form-label">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="form-input"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={loadingPassword}>
              {loadingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* 2FA Section */}
      <div className="border-t border-gray-800 pt-8">
        <h4 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication (2FA)</h4>
        {!is2FAEnabled ? (
          <div>
            {!showQRCode ? (
              <button onClick={handleEnable2FA} className="btn btn-primary">Enable 2FA</button>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium text-white">Scan QR Code</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Scan this QR code with your authenticator app.
                  </p>
                  {qrCodeUrl && (
                    <div className="flex justify-center p-4 bg-white rounded-lg">
                      <Image
                        src={qrCodeUrl}
                        alt="2FA QR Code"
                        width={200}
                        height={200}
                      />
                    </div>
                  )}
                </div>

                <form onSubmit={handleVerifyAndEnable2FA} className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="verificationCode" className="form-label">
                      Enter verification code
                    </label>
                    <input
                      type="text"
                      name="verificationCode"
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      className="form-input h-12 text-center text-xl font-mono tracking-widest"
                      required
                    />
                  </div>
                  <div className="flex space-x-4 pt-2">
                    <button
                      type="submit"
                      disabled={isEnabling2FA}
                      className="btn btn-success"
                    >
                      {isEnabling2FA ? "Verifying..." : "Verify & Enable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowQRCode(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-400 mb-4">2FA is currently enabled.</p>
            <button onClick={handleDisable2FA} className="btn btn-danger" disabled={isDisabling2FA}>
              {isDisabling2FA ? "Disabling..." : "Disable 2FA"}
            </button>
          </div>
        )}
      </div>

      {/* Passkey Section */}
      <div className="border-t border-gray-800 pt-8">
        <h4 className="text-lg font-semibold text-white mb-4">Passkey / Biometric Sign-in</h4>
        {!isPasskeyEnabled ? (
          <div>
            <p className="text-gray-400 mb-4">Secure your account and sign in with a passkey (e.g., Face ID, fingerprint, or a physical security key).</p>
            <button onClick={handleRegisterPasskey} className="btn btn-primary" disabled={isRegisteringPasskey}>
              {isRegisteringPasskey ? "Registering..." : "Register a Passkey"}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-400 mb-4">A passkey is registered for this account.</p>
            <button className="btn btn-danger" disabled>Disable Passkey (Not Implemented)</button>
          </div>
        )}
      </div>
    </div>
  )
}
