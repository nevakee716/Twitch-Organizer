"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";

export interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  debounceTime?: number;
  autocompleteOptions?: string[];
}

const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(
  (
    {
      className,
      type,
      label,
      value = "",
      onChange,
      debounceTime = 300,
      autocompleteOptions,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [localValue, setLocalValue] = React.useState(value);
    const inputId = React.useId();
    const datalistId = `${inputId}-autocomplete`;

    const debouncedOnChange = useDebounce((value: string) => {
      onChange?.({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
    }, debounceTime);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <Input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            isFloating
              ? "placeholder-muted-foreground/60"
              : "placeholder-transparent",
            className
          )}
          ref={ref}
          {...props}
          id={inputId}
          list={autocompleteOptions ? datalistId : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          value={localValue}
        />
        <Label
          htmlFor={inputId}
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none",
            isFloating
              ? "text-sm -top-3 left-2 bg-background px-1.5 text-muted-foreground"
              : "text-base top-1.5 text-muted-foreground/60"
          )}
        >
          {label}
        </Label>
        {autocompleteOptions && (
          <datalist id={datalistId}>
            {autocompleteOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        )}
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
