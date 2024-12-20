import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export interface Option {
  value: string;
  label: string;
}

interface PopupSelectProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PopupSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
}: PopupSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openUpward, setOpenUpward] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const menuHeight = Math.min(options.length * 36 + 8, 200); // Estimation de la hauteur du menu

      setOpenUpward(spaceBelow < menuHeight && spaceAbove > spaceBelow);
    }
  }, [isOpen, options.length]);

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className={cn("w-[180px] justify-between", className)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption?.label ?? placeholder}
        <Icon 
          icon={isOpen ? "lucide:chevron-up" : "lucide:chevron-down"} 
          className="ml-2 h-4 w-4 shrink-0" 
        />
      </Button>
      
      {isOpen && (
        <div 
          className={cn(
            "absolute z-50 w-full rounded-md border bg-popover shadow-md",
            openUpward ? "bottom-[calc(100%+4px)]" : "top-[calc(100%+4px)]"
          )}
        >
          <div className="max-h-[200px] overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onValueChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "relative flex w-full items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value === option.value && "bg-accent text-accent-foreground"
                )}
              >
                <Icon
                  icon="lucide:check"
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 