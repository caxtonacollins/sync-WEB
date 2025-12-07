"use client"

import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Layout from "@/components/Layout"
import { Cog6ToothIcon, UserCircleIcon, ShieldCheckIcon, DocumentCheckIcon } from "@heroicons/react/24/outline"
import ProfileSettings from "@/components/settings/ProfileSettings"

// Placeholder components for each settings tab
import { SecuritySettings } from "@/components/shared/SecuritySettings"
import KycSettings from "@/components/settings/KycSettings"

const tabs = [
  { id: "profile", name: "Profile", icon: UserCircleIcon, component: ProfileSettings },
  { id: "security", name: "Security", icon: ShieldCheckIcon, component: SecuritySettings },
  { id: "kyc", name: "KYC Verification", icon: DocumentCheckIcon, component: KycSettings },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || ProfileSettings

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Cog6ToothIcon className="h-8 w-8 mr-3 text-gray-400" />
              Settings
            </h1>
            <p className="mt-2 text-gray-400">Manage your account settings and preferences.</p>
          </div>

          <div className="flex space-x-8 border-b border-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-purple-500 text-purple-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          <div className="fade-in">
            <ActiveComponent onUpdate={() => { }} onError={() => { }} />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
