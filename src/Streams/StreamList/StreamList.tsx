// components/Files.tsx
import React, { useEffect, useState } from "react";
import { useStreamStore } from "../Stores/useStore";
import { StreamAccordeon } from "./StreamAccordeon";
import { FolderTree } from "./FolderTree";
import { StreamExplorerView } from "./StreamExplorerView";
import { StreamListSettings } from "./StreamListSettings";
import { StreamListEmpty } from "./StreamListEmpty";

export const StreamList = () => {
  const {
    options,
    refreshOnlineStatus,
    bookmarkAndFilteredStreams,
    anyStreams,
    bookmarks,
  } = useStreamStore();
  const [isInitializing, setIsInitializing] = useState(false);
  const [selectedBookmarkStreamsId, setSelectedBookmarkStreamsId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const init = async () => {
      await refreshOnlineStatus();
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-twitch-bg-primary text-twitch-text-primary">
      <div className="sticky top-0 z-10 bg-twitch-bg-primary border-b border-twitch-border-active p-4 backdrop-blur-sm bg-opacity-90 hover:bg-twitch-bg-hover">
        <div className="flex justify-between items-center h-10">
          <StreamListSettings />
        </div>
      </div>
      {!anyStreams ? (
        <StreamListEmpty isInitializing={isInitializing} />
      ) : (
        bookmarkAndFilteredStreams && (
          <div className="p-4 space-y-4">
            {options.isExplorerView ? (
              <div className="flex h-[calc(100vh-4rem)]">
                <div className="w-1/4 border-r border-twitch-border-active p-4 overflow-y-auto">
                  <FolderTree
                    selectedBookmarkStreamsId={selectedBookmarkStreamsId}
                    onSelectBookmarkStream={setSelectedBookmarkStreamsId}
                    bookmarkStreams={bookmarkAndFilteredStreams}
                  />
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                  <StreamExplorerView
                    bookmarkStreams={bookmarkAndFilteredStreams}
                    selectedBookmarkStreamsId={selectedBookmarkStreamsId}
                  />
                </div>
              </div>
            ) : (
              <StreamAccordeon
                key={bookmarkAndFilteredStreams.id}
                isAlwaysOpen={true}
                bookmarkStreams={bookmarkAndFilteredStreams}
              />
            )}
          </div>
        )
      )}

      {bookmarkAndFilteredStreams?.totalCount === 0 && anyStreams && (
        <div className="p-4 text-center text-twitch-text-secondary">
          No streams found
        </div>
      )}
    </div>
  );
};

export default StreamList;
