// components/ui/switch.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, onCheckedChange, ...props }, ref) => (
        <div className="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-input"
             onClick={() => onCheckedChange?.(!props.checked)}>
            <input
                type="checkbox"
                className="sr-only"
                ref={ref}
                {...props}
            />
            <span
                aria-hidden="true"
                className={cn(
                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out",
                    props.checked ? "translate-x-5" : "translate-x-0"
                )}
            />
        </div>
    )
)
Switch.displayName = "Switch"

export { Switch }