// components/ui/dialog.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface DialogProps {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    className?: string
}

export const DialogOverlay = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/80",
            className
        )}
        {...props}
    />
))
DialogOverlay.displayName = "DialogOverlay"

export const DialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
            ref={ref}
            className={cn(
                "w-full max-w-lg max-h-[90vh] overflow-y-auto border bg-background p-6 shadow-lg sm:rounded-lg relative",
                "mx-4",  // Add horizontal margin on small screens
                className
            )}
            {...props}
        >
            {children}
        </div>
    </div>
))
DialogContent.displayName = "DialogContent"

export function Dialog({ children, open, onOpenChange }: DialogProps) {
    if (!open) return null

    return (
        <>
            <DialogOverlay onClick={() => onOpenChange?.(false)} />
            {children}
        </>
    )
}

export default Dialog