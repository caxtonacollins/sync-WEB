"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import Image from "next/image"
import { disable2FA, enable2FA, generate2FA } from "@/api/routes/auth"

export default function SecurityPage() {
  const { user, token } = useAuth()
  const { addToast } = useToast()
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isEnabling2FA, setIsEnabling2FA] = useState(false)
  const [isDisabling2FA, setIsDisabling2FA] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)

  useEffect(() => {
    // Check if 2FA is already enabled for the user
    // This would typically come from the user data or a separate API call
    setIs2FAEnabled(false) // Default to false for demo
  }, [])

  const handleEnable2FA = async () => {
    if (!token) return;
    try {
      const data = await generate2FA(token);
      setQrCodeUrl(data.qrCodeUrl);
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
      setIs2FAEnabled(true);
      setShowQRCode(false);
      setVerificationCode("");
      addToast("2FA enabled successfully!", "success");
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
      setIs2FAEnabled(false);
      addToast("2FA disabled successfully", "success");
    } catch (error) {
      addToast("Failed to disable 2FA", "error");
    } finally {
      setIsDisabling2FA(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Security Settings</h1>

            <div className="mt-6">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Two-Factor Authentication</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Add an extra layer of security to your account by enabling two-factor authentication.</p>
                  </div>

                  {!is2FAEnabled ? (
                    <div className="mt-5">
                      {!showQRCode ? (
                        <button
                          onClick={handleEnable2FA}
                          className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Enable 2FA
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-md font-medium text-gray-900">Scan QR Code</h4>
                            <p className="text-sm text-gray-500 mb-4">
                              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                            </p>
                            {qrCodeUrl && (
                              <div className="flex justify-center">
                                <Image
                                  src={qrCodeUrl || "/placeholder.svg"}
                                  alt="2FA QR Code"
                                  width={200}
                                  height={200}
                                  className="border rounded-lg"
                                />
                              </div>
                            )}
                          </div>

                          <form onSubmit={handleVerifyAndEnable2FA} className="space-y-6">
                            <div className="form-group">
                              <label htmlFor="verificationCode" className="form-label">
                                Enter verification code from your app
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
                              <p className="text-sm text-gray-400 mt-1">
                                Enter the 6-digit code from your authenticator app
                              </p>
                            </div>
                            <div className="flex space-x-4 pt-2">
                              <button
                                type="submit"
                                disabled={isEnabling2FA}
                                className="btn-success h-12 px-8 disabled:opacity-50"
                              >
                                {isEnabling2FA ? (
                                  <div className="flex items-center">
                                    <div className="loading-spinner h-4 w-4 mr-2"></div>
                                    Verifying...
                                  </div>
                                ) : (
                                  "Verify & Enable"
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowQRCode(false)}
                                className="btn-secondary h-12 px-8"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-5">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">2FA is enabled</p>
                          <p className="text-sm text-gray-500">
                            Your account is protected with two-factor authentication
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handleDisable2FA}
                          disabled={isDisabling2FA}
                          className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          {isDisabling2FA ? "Disabling..." : "Disable 2FA"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
