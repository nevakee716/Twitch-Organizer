import React from "react";
import { BookmarkStream } from "@/types/bookmark";
import { TwitchStream } from "@/types/twitch";
import { StreamGrid } from "./StreamGrid";
import { useStreamStore } from "../Stores/useStore";
import {
  getAllStreamsInFolder,
  filterAndSortStreams,
} from "@/utils/streamUtils";

interface StreamExplorerViewProps {
  bookmarkStreams: BookmarkStream[];
  selectedFolderId: string | null;
}

export const StreamExplorerView: React.FC<StreamExplorerViewProps> = ({
  bookmarkStreams,
  selectedFolderId,
}) => {
  const { options } = useStreamStore();

  const selectedFolder = React.useMemo(() => {
    if (!selectedFolderId) return null;

    const findFolder = (folders: BookmarkStream[]): BookmarkStream | null => {
      for (const folder of folders) {
        if (folder.id === selectedFolderId) return folder;
        if (folder.children) {
          const found = findFolder(folder.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findFolder(bookmarkStreams);
  }, [bookmarkStreams, selectedFolderId]);

  if (!selectedFolder) {
    return (
      <div className="flex items-center justify-center h-full text-twitch-text-secondary">
        Sélectionnez un dossier pour voir ses streams
      </div>
    );
  }

  const streams = getAllStreamsInFolder(selectedFolder, bookmarkStreams);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{selectedFolder.title}</h2>
        <span className="text-sm text-twitch-text-secondary">
          {bookmarkStreams.onlineCount} en ligne / {streams.length} total
        </span>
      </div>
      <StreamGrid streams={streams} />
    </div>
  );
};
