"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TwitchSwitchProps
  extends Omit<HTMLMotionProps<"button">, "checked" | "onCheckedChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const TwitchSwitch = React.forwardRef<HTMLButtonElement, TwitchSwitchProps>(
  ({ className, checked = false, onCheckedChange, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative w-[52px] h-[32px] rounded-full p-1 cursor-pointer",
          "transition-colors duration-200 border-2",
          checked
            ? "border-twitch-border-active bg-transparent"
            : "border-twitch-border-default bg-transparent",
          className
        )}
        onClick={() => onCheckedChange?.(!checked)}
        aria-checked={checked}
        role="switch"
        {...props}
      >
        <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10">
          <Check
            className={cn(
              "w-4 h-4 transition-opacity duration-200",
              checked ? "opacity-100 text-twitch-border-active" : "opacity-0"
            )}
          />
        </div>
        <motion.div
          className={cn(
            "absolute top-[2px] left-[2px] w-[24px] h-[24px] rounded-full shadow-sm",
            checked ? "bg-twitch-border-active" : "bg-twitch-text-secondary"
          )}
          animate={{
            x: checked ? 20 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </motion.button>
    );
  }
);

TwitchSwitch.displayName = "TwitchSwitch";

export { TwitchSwitch };
