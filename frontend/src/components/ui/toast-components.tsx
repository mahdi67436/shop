import * as React from "react"
import { type ToastProps } from "@/components/ui/toast"

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ToastProps
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-background border-foreground/10",
    success: "bg-green-600 text-white border-green-700",
    error: "bg-red-600 text-white border-red-700",
    warning: "bg-yellow-600 text-white border-yellow-700",
  }
  return (
    <div
      ref={ref}
      className={`border rounded-lg p-4 shadow-lg ${variantClasses[variant]} ${className || ""}`}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={`absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100 ${className || ""}`}
    {...props}
  >
    ✕
  </button>
))
ToastClose.displayName = "ToastClose"

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm opacity-90 ${className || ""}`}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const ToastTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm font-semibold ${className || ""}`}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastViewport = () => null

export {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
}
