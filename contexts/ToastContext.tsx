"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
  timeoutId?: NodeJS.Timeout
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: "success" | "error" | "info", options?: { timeout?: number }) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return () => {
      toasts.forEach(toast => {
        if (toast.timeoutId) {
          clearTimeout(toast.timeoutId)
        }
      })
    }
  }, [toasts])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => {
      const toastToRemove = prev.find(toast => toast.id === id)
      if (toastToRemove?.timeoutId) {
        clearTimeout(toastToRemove.timeoutId)
      }
      return prev.filter(toast => toast.id !== id)
    })
  }, [])

  const addToast = useCallback((
    message: string, 
    type: "success" | "error" | "info",
    options: { timeout?: number } = {}
  ) => {
    const { timeout = 5000 } = options
    
    setToasts(prev => {
      const existingToast = prev.find(t => t.message === message)
      if (existingToast) return prev

      const id = Math.random().toString(36).substr(2, 9)
      const timeoutId = setTimeout(() => removeToast(id), timeout)
      
      return [...prev, { id, message, type, timeoutId }]
    })
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  const getToastIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-5 w-5" />
      case "error":
        return <XCircleIcon className="h-5 w-5" />
      case "info":
        return <InformationCircleIcon className="h-5 w-5" />
      default:
        return <InformationCircleIcon className="h-5 w-5" />
    }
  }

  const getToastStyles = (type: string) => {
    switch (type) {
      case "success":
        return "toast-success"
      case "error":
        return "toast-error"
      case "info":
        return "toast-info"
      default:
        return "toast-info"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-dark max-w-sm transform transition-all duration-300 ease-in-out ${getToastStyles(toast.type)} fade-in`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getToastIcon(toast.type)}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-current hover:opacity-70 transition-opacity"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
