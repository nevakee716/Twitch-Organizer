import React from "react";
import { BookmarkStreams } from "@/types/bookmark";
import { StreamGrid } from "./StreamGrid";
import { useStreamStore } from "../Stores/useStore";
interface StreamExplorerViewProps {
  bookmarkStreams: BookmarkStreams;
  selectedBookmarkStreamsId: string | null;
}

export const StreamExplorerView: React.FC<StreamExplorerViewProps> = ({
  bookmarkStreams,
  selectedBookmarkStreamsId,
}) => {
  const selectedBookmarkStream = React.useCallback(() => {
    if (!selectedBookmarkStreamsId) return null;

    const findBookmarkStream = (
      bookmarkStreams: BookmarkStreams[]
    ): BookmarkStreams | null => {
      console.log("selectedBookmarkStreamsId", selectedBookmarkStreamsId);
      for (const bookmarkStream of bookmarkStreams) {
        if (bookmarkStream.id === selectedBookmarkStreamsId) {
          console.log("found", bookmarkStream.title);
          return bookmarkStream;
        }
        const found = findBookmarkStream(bookmarkStream.children);
        console.log("found", found?.title);
        if (found) return found;
      }
      return null;
    };
    return findBookmarkStream([bookmarkStreams]);
  }, [bookmarkStreams, selectedBookmarkStreamsId])();

  if (!selectedBookmarkStreamsId) {
    return (
      <div className="flex items-center justify-center h-full text-twitch-text-secondary">
        Sélectionnez un dossier pour voir ses streams
      </div>
    );
  }

  if (!selectedBookmarkStream) {
    return (
      <div className="flex items-center justify-center h-full text-twitch-text-secondary">
        Aucun stream trouvé
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{selectedBookmarkStream.title}</h2>
        <span className="text-sm text-twitch-text-secondary">
          {selectedBookmarkStream.onlineCount} /{" "}
          {selectedBookmarkStream.filteredCount}
        </span>
      </div>
      <StreamGrid bookmarkStreams={selectedBookmarkStream} />
    </div>
  );
};
