"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
export interface FloatingLabelTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  debounceTime?: number;
}

const FloatingLabelTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FloatingLabelTextareaProps
>(
  (
    { className, label, value = "", onChange, debounceTime = 300, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [localValue, setLocalValue] = React.useState(value);

    const debouncedOnChange = useDebounce((value: string) => {
      onChange?.({
        target: { value },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }, debounceTime);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      debouncedOnChange(newValue);
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const isFloating = isFocused || String(localValue).length > 0;

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    return (
      <div className="relative mt-2.5">
        <Textarea
          className={cn(
            "pt-6 pb-2 min-h-[80px]",
            isFloating
              ? "placeholder-muted-foreground/60"
              : "placeholder-transparent",
            className
          )}
          ref={ref}
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          value={localValue}
        />
        <Label
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none",
            isFloating
              ? "text-sm -top-3.5 bg-background px-1 text-muted-foreground"
              : "text-base top-2 text-muted-foreground/60"
          )}
        >
          {label}
        </Label>
      </div>
    );
  }
);
FloatingLabelTextarea.displayName = "FloatingLabelTextarea";

export { FloatingLabelTextarea };
