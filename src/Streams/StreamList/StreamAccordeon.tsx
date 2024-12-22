import React, { useEffect, useState } from "react";
import { BookmarkStreams } from "@/types/bookmark";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Folder, Radio } from "lucide-react";
import { StreamGrid } from "./StreamGrid";
import { cn } from "@/lib/utils";
import { sortStreams } from "@/utils/streamUtils";

interface StreamAccordeonProps {
  bookmarkStreams: BookmarkStreams;
  isAlwaysOpen?: boolean;
}

export const StreamAccordeon = ({
  bookmarkStreams,
  isAlwaysOpen = false,
}: StreamAccordeonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isAlwaysOpen) {
      setIsOpen(true);
    }
  }, [isAlwaysOpen]);

  return (
    <Accordion type="multiple" value={isOpen ? [bookmarkStreams.id] : []}>
      <AccordionItem
        value={bookmarkStreams.id}
        className={cn(
          "border rounded-lg transition-colors",
          "bg-twitch-bg-secondary border-twitch-border-active hover:border-twitch-border-hover"
        )}
      >
        <AccordionTrigger
          className="px-4 py-2 hover:no-underline hover:bg-twitch-bg-hover data-[state=open]:bg-twitch-bg-hover transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            <Folder className="h-4 w-4 text-twitch-brand-primary" />
            <span className="text-twitch-text-primary">
              {bookmarkStreams.title}
            </span>
            <div className="flex items-center gap-1">
              <Radio
                className={cn(
                  "h-3 w-3",
                  bookmarkStreams.onlineCount > 0
                    ? "text-twitch-status-live"
                    : "text-twitch-text-secondary"
                )}
                fill={bookmarkStreams.onlineCount > 0 ? "currentColor" : "none"}
              />
              <span className="text-sm text-twitch-text-secondary">
                {bookmarkStreams.onlineCount}/{bookmarkStreams.filteredCount}
              </span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4">
          <div className="space-y-4">
            {bookmarkStreams.children.map((subfolder) => (
              <StreamAccordeon
                key={subfolder.id}
                bookmarkStreams={subfolder}
                isAlwaysOpen={bookmarkStreams.children.length === 1}
              />
            ))}
            {bookmarkStreams.streams.length > 0 && (
              <StreamGrid streams={sortStreams(bookmarkStreams.streams)} />
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
