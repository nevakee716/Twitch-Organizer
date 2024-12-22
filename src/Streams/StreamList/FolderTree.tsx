import React, { useEffect } from "react";
import { BookmarkStreams } from "@/types/bookmark";
import { cn } from "@/lib/utils";
import { FolderIcon, ChevronRight, Radio } from "lucide-react";

interface FolderTreeProps {
  bookmarkStreams: BookmarkStreams;
  selectedBookmarkStreamsId: string | null;
  isAlwaysOpen?: boolean;
  onSelectBookmarkStream: (id: string) => void;
}

const FolderTreeItem = ({
  bookmarkStream,
  selectedBookmarkStreamsId,
  onSelectBookmarkStream,
  isAlwaysOpen = false,
  level = 0,
  isSingleFolder = false,
}: {
  bookmarkStream: BookmarkStreams;
  selectedBookmarkStreamsId: string | null;
  onSelectBookmarkStream: (id: string) => void;
  level?: number;
  isSingleFolder?: boolean;
  isAlwaysOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    if (isAlwaysOpen || isSingleFolder) {
      setIsOpen(true);
    }

    if (isSingleFolder && bookmarkStream.children.length === 0) {
      onSelectBookmarkStream(bookmarkStream.id);
    }
  }, [
    isAlwaysOpen,
    isSingleFolder,
    bookmarkStream.children.length,
    bookmarkStream.id,
  ]);

  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelectBookmarkStream(bookmarkStream.id)}
        className={cn(
          "flex items-center w-full px-2 py-1 text-sm rounded-md",
          "hover:bg-twitch-bg-hover",
          selectedBookmarkStreamsId === bookmarkStream.id &&
            "bg-twitch-border-active text-white",
          "transition-colors"
        )}
        style={{ paddingLeft: `${level * 0.5}rem` }}
      >
        <div className="flex items-center flex-1">
          <div className="w-4 mr-1">
            {bookmarkStream.children.length > 0 && (
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "transform rotate-90"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              />
            )}
          </div>
          <FolderIcon className="h-4 w-4 mr-2" />
          <span className="truncate">{bookmarkStream.title}</span>
        </div>

        <div className="flex items-center justify-around gap-1 ml-2">
          <Radio
            className={cn(
              "h-3 w-3",
              bookmarkStream.onlineCount > 0
                ? "text-twitch-status-live"
                : "text-twitch-text-secondary"
            )}
            fill={bookmarkStream.onlineCount > 0 ? "currentColor" : "none"}
          />
          <span className="w-4 text-sm text-twitch-text-secondary">
            {bookmarkStream.onlineCount}/{bookmarkStream.filteredCount}
          </span>
        </div>
      </button>

      {isOpen && bookmarkStream.children.length > 0 && (
        <div className="ml-2">
          {bookmarkStream.children.map((subfolder) => (
            <FolderTreeItem
              key={subfolder.id}
              bookmarkStream={subfolder}
              isSingleFolder={
                isSingleFolder && bookmarkStream.children.length === 1
              }
              selectedBookmarkStreamsId={selectedBookmarkStreamsId}
              onSelectBookmarkStream={onSelectBookmarkStream}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  bookmarkStreams,
  selectedBookmarkStreamsId,
  onSelectBookmarkStream,
}) => {
  return (
    <div className="space-y-1">
      {[bookmarkStreams].map((bookmarkStream) => (
        <FolderTreeItem
          key={bookmarkStream.id}
          isAlwaysOpen={true}
          isSingleFolder={true}
          bookmarkStream={bookmarkStream}
          selectedBookmarkStreamsId={selectedBookmarkStreamsId}
          onSelectBookmarkStream={onSelectBookmarkStream}
        />
      ))}
    </div>
  );
};
