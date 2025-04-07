import * as React from "react"

export type ToastProps = {
  variant?: "default" | "destructive"
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  children?: React.ReactNode
  id?: string
}

export type ToastActionElement = React.ReactElement
