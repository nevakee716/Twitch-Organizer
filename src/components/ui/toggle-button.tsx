"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleGroupProps {
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function ToggleGroup({
  options = ["Red", "Green", "Blue"],
  defaultValue,
  onChange,
}: ToggleGroupProps) {
  const [selected, setSelected] = React.useState(defaultValue || options[0]);

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className="inline-flex rounded-md border border-twitch-border-default bg-twitch-bg-secondary shadow-sm">
      {options.map((option, index) => {
        const isSelected = selected === option;
        return (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={cn(
              "relative px-4 py-1.5 text-sm font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-twitch-brand-primary focus-visible:ring-offset-2",
              isSelected && "bg-twitch-brand-primary text-white",
              !isSelected && "text-twitch-text-primary hover:bg-twitch-bg-hover",
              index === 0 && "rounded-l-md",
              index === options.length - 1 && "rounded-r-md",
              index !== options.length - 1 && "border-r border-twitch-border-default"
            )}
          >
            <span className="flex items-center gap-2">
              {isSelected && <Check className="h-3 w-3" />}
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
}
