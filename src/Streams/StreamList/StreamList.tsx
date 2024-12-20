// components/Files.tsx
import React, { useEffect, useState } from "react";
import { useStreamStore } from "../Stores/useStore";
import { Accordion } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { BookmarkFolder } from "./BookmarkFolder";
import { StreamsPerRowControl } from "./StreamsPerRowControl";
import { TWITCH_THEME } from "@/config/theme";
import { Switch } from "@/components/ui/switch";

export const StreamList = () => {
  const {
    bookmarks,
    onlineStreams,
    loadBookmarks,
    refreshOnlineStatus,
    isCompactView,
    setCompactView,
  } = useStreamStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [openFolders, setOpenFolders] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      await loadBookmarks();
      await refreshOnlineStatus();
    };
    init();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setOpenFolders([]);
      return;
    }

    const foldersToOpen = bookmarks
      .filter((folder) =>
        folder.children?.some((bookmark) => {
          const stream = onlineStreams[bookmark.title.toLowerCase()];
          if (!stream) return false;

          const searchLower = searchTerm.toLowerCase();
          return (
            stream.user_name.toLowerCase().includes(searchLower) ||
            stream.title?.toLowerCase().includes(searchLower) ||
            stream.game_name?.toLowerCase().includes(searchLower)
          );
        })
      )
      .map((folder) => folder.id);

    setOpenFolders(foldersToOpen);
  }, [searchTerm, bookmarks, onlineStreams]);

  return (
    <div className="min-h-screen bg-twitch-bg-primary text-twitch-text-primary">
      <div
        className="
        sticky 
        top-0 
        z-10 
        bg-twitch-bg-primary
        border-b 
        border-twitch-border-default
        p-4
        backdrop-blur-sm
        bg-opacity-90
        hover:bg-twitch-bg-hover
      "
      >
        <div className="flex justify-between items-center h-10">
          <Input
            type="text"
            placeholder="Search streams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 bg-twitch-bg-secondary border-twitch-border-default text-twitch-text-primary placeholder:text-twitch-text-secondary"
          />
          <div className="flex items-center justify-center align-middle space-x-6">
            <span className="text-sm text-[#efeff1]">Compact</span>
            <Switch
              checked={isCompactView || false}
              onCheckedChange={(value: boolean) => setCompactView(value)}
            />
            <StreamsPerRowControl />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Accordion
          type="multiple"
          className="space-y-4"
          value={openFolders}
          onValueChange={setOpenFolders}
        >
          {bookmarks.map((folder) => (
            <BookmarkFolder
              key={folder.id}
              folder={folder}
              onlineStreams={onlineStreams}
              searchTerm={searchTerm}
            />
          ))}
        </Accordion>

        {bookmarks.length === 0 && (
          <div className="text-center text-gray-500">No bookmarks found</div>
        )}
      </div>
    </div>
  );
};

export default StreamList;
