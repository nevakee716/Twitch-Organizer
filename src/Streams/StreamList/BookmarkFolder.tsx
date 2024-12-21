import React, { useEffect, useState } from "react";
import { BookmarkNode } from "@/utils/bookmarks";
import { TwitchStream } from "@/types/twitch";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useStreamStore } from "@/Streams/Stores/useStore";
import { Folder, Radio } from "lucide-react";
import { StreamGrid } from "./StreamGrid";
import { calculateStreamCounts } from "@/utils/streamUtils";
import { filterAndSortStreams } from "@/utils/streamUtils";

interface BookmarkFolderProps {
  folder: BookmarkNode;
  onlineStreams: Record<string, TwitchStream>;
}

export const BookmarkFolder = ({
  folder,
  onlineStreams,
}: BookmarkFolderProps) => {
  const [shouldBeOpen, setShouldBeOpen] = useState(false);
  const { hideOfflineStreams, options } = useStreamStore();

  useEffect(() => {
    if (!options.searchTerm) {
      setShouldBeOpen(false);
      return;
    }

    // Vérifie si un stream dans ce dossier correspond à la recherche
    const hasMatchingStream = folder.children?.some((bookmark) => {
      const stream = onlineStreams[bookmark.title.toLowerCase()];
      const searchLower = options.searchTerm.toLowerCase();
      const bookmarkTitle = bookmark.title.toLowerCase();

      return (
        bookmarkTitle.includes(searchLower) ||
        stream?.user_name.toLowerCase().includes(searchLower) ||
        stream?.title?.toLowerCase().includes(searchLower) ||
        stream?.game_name?.toLowerCase().includes(searchLower)
      );
    });

    setShouldBeOpen(hasMatchingStream ?? false);
  }, [options.searchTerm, folder, onlineStreams]);

  // Créer un tableau de tous les streams (online et offline)
  const allStreams =
    folder.children
      ?.filter((child) => child.url?.includes("twitch.tv"))
      .map((bookmark) => {
        const stream = onlineStreams[bookmark.title.toLowerCase()];
        return {
          ...(stream || { user_name: bookmark.title }),
          isLive: !!stream,
        };
      }) || [];

  const filteredAndSortedStreams = filterAndSortStreams(
    allStreams,
    options.searchTerm,
    hideOfflineStreams
  );

  // Calculer le nombre de streams online et total
  const streamCounts = calculateStreamCounts(folder, onlineStreams);

  if (options.searchTerm && filteredAndSortedStreams.length === 0) {
    return null;
  }

  return (
    <AccordionItem
      value={folder.id}
      className="
        border 
        rounded-lg
        bg-twitch-bg-secondary
        border-twitch-border-default
        hover:border-twitch-border-hover
        transition-colors
      "
    >
      <AccordionTrigger
        className="
          px-4 py-2
          hover:no-underline 
          hover:bg-twitch-bg-hover
          data-[state=open]:bg-twitch-bg-hover
          transition-colors
        "
      >
        <div className="flex items-center gap-3">
          <Folder className="h-4 w-4 text-twitch-brand-primary" />
          <span className="text-twitch-text-primary">{folder.title}</span>
          <div className="flex items-center gap-1">
            <Radio
              className={`h-3 w-3 ${
                streamCounts.online > 0
                  ? "text-twitch-status-live"
                  : "text-twitch-text-secondary"
              }`}
              fill={streamCounts.online > 0 ? "currentColor" : "none"}
            />
            <span className="text-sm text-twitch-text-secondary">
              {streamCounts.online}/{streamCounts.total}
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-4">
          {folder.children
            ?.filter((child) => child.children)
            .map((subfolder) => (
              <BookmarkFolder
                key={subfolder.id}
                folder={subfolder}
                onlineStreams={onlineStreams}
              />
            ))}

          <StreamGrid streams={filteredAndSortedStreams} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
