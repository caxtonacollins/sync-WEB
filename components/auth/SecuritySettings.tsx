"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MfaSetup } from "./MfaSetup";
import PasskeyLogin from "./PasskeyLogin";
import { BiometricAuth } from "./BiometricAuth";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { setPin, changePin } from "@/api/routes/security";

interface SecuritySettingsProps {
  onUpdate: (settings: any) => void;
  onError: (error: Error) => void;
}

interface SecurityStatus {
  mfaEnabled: boolean;
  passkeyEnabled: boolean;
  biometricsEnabled: boolean;
  lastPasswordChange: string;
  recentLogins: Array<{
    date: string;
    device: string;
    location: string;
  }>;
}

export function SecuritySettings({ onUpdate, onError }: SecuritySettingsProps) {
  const [status, setStatus] = useState<SecurityStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDialog, setActiveDialog] = useState<"mfa" | "passkey" | "biometric" | "password" | null>(null);
  const [newPassword, setNewPassword] = useState({ current: "", new: "", confirm: "" });
  const { user, token } = useAuth();
  const [pinForm, setPinForm] = useState({ pin: "", confirm: "", oldPin: "", newPin: "", newConfirm: "" });

  useEffect(() => {
    fetchSecurityStatus();
  }, []);

  const fetchSecurityStatus = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/security/status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Failed to fetch security status";
      setError(message);
      onError(new Error(message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSuccess = async (result: any) => {
    setActiveDialog(null);
    setStatus((prev) => prev ? { ...prev, mfaEnabled: true } : null);
    onUpdate({ mfaEnabled: true });
  };

  const handlePasskeySuccess = async (result: any) => {
    setActiveDialog(null);
    setStatus((prev) => prev ? { ...prev, passkeyEnabled: true } : null);
    onUpdate({ passkeyEnabled: true });
  };

  const handleBiometricSuccess = async (result: any) => {
    setActiveDialog(null);
    setStatus((prev) => prev ? { ...prev, biometricsEnabled: true } : null);
    onUpdate({ biometricsEnabled: true });
  };

  const handlePasswordChange = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (newPassword.new !== newPassword.confirm) {
        throw new Error("New passwords don't match");
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/security/password`,
        {
          currentPassword: newPassword.current,
          newPassword: newPassword.new,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActiveDialog(null);
      setNewPassword({ current: "", new: "", confirm: "" });
      await fetchSecurityStatus();
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Failed to change password";
      setError(message);
      onError(new Error(message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableSecurity = async (type: "mfa" | "passkey" | "biometric") => {
    try {
      setIsLoading(true);
      setError(null);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/security/${type}/disable`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchSecurityStatus();
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || `Failed to disable ${type}`;
      setError(message);
      onError(new Error(message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (pinForm.pin.length !== 4 || pinForm.pin !== pinForm.confirm) {
        throw new Error("PINs must match and be 4 digits");
      }
      if (!user || !token) {
        throw new Error("User or token not found");
      }
      await setPin(user.id, pinForm.pin, token);
      setPinForm({ pin: "", confirm: "", oldPin: "", newPin: "", newConfirm: "" });
      onUpdate({ paymentPinSet: true });
    } catch (err) {
      const e = err as Error;
      setError(e.message);
      onError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (pinForm.newPin.length !== 4 || pinForm.newPin !== pinForm.newConfirm) {
        throw new Error("New PINs must match and be 4 digits");
      }
      await changePin(user!.id, pinForm.oldPin, pinForm.newPin, token as string);
      setPinForm({ pin: "", confirm: "", oldPin: "", newPin: "", newConfirm: "" });
      onUpdate({ paymentPinChanged: true });
    } catch (err) {
      const e = err as Error;
      setError(e.message);
      onError(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!status) {
    return <div>Loading security settings...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Two-Factor Authentication */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <Switch
            checked={status.mfaEnabled}
            onCheckedChange={(checked) => {
              if (checked) {
                setActiveDialog("mfa");
              } else {
                handleDisableSecurity("mfa");
              }
            }}
          />
        </div>
        {status.mfaEnabled && (
          <p className="text-sm text-green-600">MFA is enabled for your account</p>
        )}
      </Card>

      {/* Passkey Authentication */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">Passkey Authentication</h3>
            <p className="text-sm text-gray-500">Sign in without passwords using your device</p>
          </div>
          <Switch
            checked={status.passkeyEnabled}
            onCheckedChange={(checked) => {
              if (checked) {
                setActiveDialog("passkey");
              } else {
                handleDisableSecurity("passkey");
              }
            }}
          />
        </div>
        {status.passkeyEnabled && (
          <p className="text-sm text-green-600">Passkey is set up for your account</p>
        )}
      </Card>

      {/* Biometric Authentication */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">Biometric Authentication</h3>
            <p className="text-sm text-gray-500">Use your device's biometric features to sign in</p>
          </div>
          <Switch
            checked={status.biometricsEnabled}
            onCheckedChange={(checked) => {
              if (checked) {
                setActiveDialog("biometric");
              } else {
                handleDisableSecurity("biometric");
              }
            }}
          />
        </div>
        {status.biometricsEnabled && (
          <p className="text-sm text-green-600">Biometric authentication is enabled</p>
        )}
      </Card>

      {/* Password Management */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">Password Management</h3>
            <p className="text-sm text-gray-500">
              Last changed: {new Date(status.lastPasswordChange).toLocaleDateString()}
            </p>
          </div>
          <Button onClick={() => setActiveDialog("password")}>
            Change Password
          </Button>
        </div>
      </Card>

      {/* Payment PIN */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">Payment PIN</h3>
            <p className="text-sm text-gray-500">Set or change your 4-digit payment PIN</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Set PIN</label>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="••••"
                maxLength={4}
                value={pinForm.pin}
                onChange={(e) => setPinForm((p) => ({ ...p, pin: e.target.value.replace(/\D/g, "") }))}
              />
              <Input
                type="password"
                placeholder="Confirm"
                maxLength={4}
                value={pinForm.confirm}
                onChange={(e) => setPinForm((p) => ({ ...p, confirm: e.target.value.replace(/\D/g, "") }))}
              />
              <Button onClick={handleSetPin} disabled={!token || !user || isLoading}>Set</Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Change PIN</label>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Old"
                maxLength={4}
                value={pinForm.oldPin}
                onChange={(e) => setPinForm((p) => ({ ...p, oldPin: e.target.value.replace(/\D/g, "") }))}
              />
              <Input
                type="password"
                placeholder="New"
                maxLength={4}
                value={pinForm.newPin}
                onChange={(e) => setPinForm((p) => ({ ...p, newPin: e.target.value.replace(/\D/g, "") }))}
              />
              <Input
                type="password"
                placeholder="Confirm"
                maxLength={4}
                value={pinForm.newConfirm}
                onChange={(e) => setPinForm((p) => ({ ...p, newConfirm: e.target.value.replace(/\D/g, "") }))}
              />
              <Button onClick={handleChangePin} disabled={!token || !user || isLoading}>Change</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Login Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Recent Login Activity</h3>
        <div className="space-y-4">
          {status.recentLogins.map((login, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium">{login.device}</p>
                <p className="text-gray-500">{login.location}</p>
              </div>
              <p className="text-gray-500">
                {new Date(login.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Dialogs */}
      <Dialog open={activeDialog === "mfa"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          </DialogHeader>
          <MfaSetup
            onSuccess={handleMfaSuccess}
            onError={onError}
            onCancel={() => setActiveDialog(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "passkey"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Passkey</DialogTitle>
          </DialogHeader>
          <PasskeyLogin
            onSuccess={handlePasskeySuccess}
            onError={onError}
            isRegistration
            token={token || ""}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "biometric"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Biometric Authentication</DialogTitle>
          </DialogHeader>
          <BiometricAuth
            onSuccess={handleBiometricSuccess}
            onError={onError}
            isRegistration
            email={user?.email}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "password"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                value={newPassword.current}
                onChange={(e) => setNewPassword(prev => ({ ...prev, current: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword.new}
                onChange={(e) => setNewPassword(prev => ({ ...prev, new: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input
                type="password"
                value={newPassword.confirm}
                onChange={(e) => setNewPassword(prev => ({ ...prev, confirm: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setActiveDialog(null)}>
                Cancel
              </Button>
              <Button
                onClick={handlePasswordChange}
                disabled={!newPassword.current || !newPassword.new || !newPassword.confirm || isLoading}
              >
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
