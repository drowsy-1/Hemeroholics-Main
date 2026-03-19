// components/ui/radio-group.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string
    onValueChange?: (value: string) => void
    defaultValue?: string
}

interface RadioGroupContextValue {
    value?: string
    onValueChange?: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({})

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ className, value, onValueChange, children, ...props }, ref) => {
        const contextValue = React.useMemo(
            () => ({ value, onValueChange }),
            [value, onValueChange]
        )

        return (
            <RadioGroupContext.Provider value={contextValue}>
                <div
                    ref={ref}
                    className={cn("grid gap-2", className)}
                    role="radiogroup"
                    {...props}
                >
                    {children}
                </div>
            </RadioGroupContext.Provider>
        )
    }
)
RadioGroup.displayName = "RadioGroup"

export interface RadioGroupItemProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "checked" | "value"> {
    value: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
    ({ className, value, ...props }, ref) => {
        const context = React.useContext(RadioGroupContext)
        const checked = context.value === value

        return (
            <div className="relative inline-flex items-center">
                <input
                    type="radio"
                    ref={ref}
                    value={value}
                    checked={checked}
                    className="peer absolute h-4 w-4 opacity-0 cursor-pointer"
                    onChange={(e) => {
                        if (e.target.checked) {
                            context.onValueChange?.(value)
                        }
                    }}
                    {...props}
                />
                <div
                    className={cn(
                        "h-4 w-4 rounded-full border border-primary ring-offset-background transition-colors",
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
                        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                        "peer-checked:bg-primary peer-checked:text-primary-foreground",
                        className
                    )}
                >
                    {checked && (
                        <div
                            className="h-2 w-2 rounded-full bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                    )}
                </div>
            </div>
        )
    }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }