import React, { useEffect, useState } from "react";
import { BookmarkNode } from "@/utils/bookmarks";
import { TwitchStream } from "@/types/twitch";
import { StreamCard } from "./StreamCard";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TWITCH_THEME } from "@/config/theme";
import { useStreamStore } from "@/Streams/Stores/useStore";
import { getGridClass } from "./gridHelper";

interface BookmarkFolderProps {
  folder: BookmarkNode;
  onlineStreams: Record<string, TwitchStream>;
  searchTerm: string;
}

export const BookmarkFolder = ({
  folder,
  onlineStreams,
  searchTerm,
}: BookmarkFolderProps) => {
  const { streamsPerRow } = useStreamStore();
  const [shouldBeOpen, setShouldBeOpen] = useState(false);

  useEffect(() => {
    if (!searchTerm) {
      setShouldBeOpen(false);
      return;
    }

    // Vérifie si un stream dans ce dossier correspond à la recherche
    const hasMatchingStream = folder.children?.some((bookmark) => {
      const stream = onlineStreams[bookmark.title.toLowerCase()];
      const searchLower = searchTerm.toLowerCase();
      const bookmarkTitle = bookmark.title.toLowerCase();

      return (
        bookmarkTitle.includes(searchLower) ||
        stream?.user_name.toLowerCase().includes(searchLower) ||
        stream?.title?.toLowerCase().includes(searchLower) ||
        stream?.game_name?.toLowerCase().includes(searchLower)
      );
    });

    setShouldBeOpen(hasMatchingStream ?? false);
  }, [searchTerm, folder, onlineStreams]);

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

  // Filtre et tri des streams
  const filteredAndSortedStreams = allStreams
    .filter((stream) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        stream.user_name.toLowerCase().includes(searchLower) ||
        stream.title?.toLowerCase().includes(searchLower) ||
        stream.game_name?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (a.isLive === b.isLive) return 0;
      return a.isLive ? -1 : 1;
    });

  if (searchTerm && filteredAndSortedStreams.length === 0) {
    return null;
  }

  return (
    <AccordionItem
      value={folder.id}
      className={`
        border 
        rounded-lg
        bg-[${TWITCH_THEME.colors.bg.secondary}]
        hover:border-[${TWITCH_THEME.colors.border.hover}]
        transition-colors
      `}
    >
      <AccordionTrigger
        className={`
          px-4 
          hover:no-underline 
          hover:bg-[${TWITCH_THEME.colors.bg.hover}]
          data-[state=open]:bg-[${TWITCH_THEME.colors.bg.hover}]
          transition-colors
        `}
      >
        <div className="flex items-center gap-2">
          <span className={`text-[${TWITCH_THEME.colors.text.primary}]`}>
            {folder.title}
          </span>
          <span
            className={`text-sm text-[${TWITCH_THEME.colors.text.secondary}]`}
          >
            ({filteredAndSortedStreams.length})
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4">
        {/* Sous-dossiers */}
        <div className="space-y-4">
          {folder.children
            ?.filter((child) => child.children)
            .map((subfolder) => (
              <BookmarkFolder
                key={subfolder.id}
                folder={subfolder}
                onlineStreams={onlineStreams}
                searchTerm={searchTerm}
              />
            ))}

          {/* Streams */}
          <div className={`grid ${getGridClass(streamsPerRow)} gap-4`}>
            {filteredAndSortedStreams.map((stream) => (
              <StreamCard key={stream.user_name} stream={stream} />
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
