"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Icon } from "@iconify/react";

interface MenuLinkItemProps extends React.ComponentPropsWithoutRef<"a"> {
  icon?: string;
  title: string;
}

export const MenuLinkItem = React.forwardRef<
  React.ElementRef<"a">,
  MenuLinkItemProps
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <NavigationMenuLink className="mt-1" asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="flex gap-2">
          {icon && <Icon icon={icon} className="h-4 w-4" />}
          <div className="text-sm font-medium leading-none">{title}</div>
        </div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground text-left">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  );
});

export const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: string }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <MenuLinkItem title={title ?? ""} icon={icon} {...props} ref={ref}>
        {children}
      </MenuLinkItem>
    </li>
  );
});
