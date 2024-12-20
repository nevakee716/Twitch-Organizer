"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Icon } from "@iconify/react";
import { MenuLinkItem, ListItem } from "./MenuLink";

const components = [
  {
    title: "Alert Dialog",
    href: "#/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
    icon: "lucide:alert-circle",
  },
  {
    title: "Scroll-area",
    href: "#/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
    icon: "lucide:scroll",
  },
  {
    title: "Tooltip",
    href: "#/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    icon: "lucide:tooltip",
  },
];

export function NavigationMainMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <ul>
            <MenuLinkItem
              href="#/"
              title="Streams"
              icon="lucide:twitch"
            ></MenuLinkItem>
          </ul>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ul>
            <MenuLinkItem
              href="#/admin"
              title="Admin"
              icon="lucide:settings"
            ></MenuLinkItem>
          </ul>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

ListItem.displayName = "ListItem";

MenuLinkItem.displayName = "MenuLinkItem";
