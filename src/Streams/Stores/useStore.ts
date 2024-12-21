// stores/useFileStore.ts
import { create } from "zustand";
import browser from "webextension-polyfill";
import type { TwitchCredentials } from "@/types/twitchCredential";
import { APIClient } from "@/api/requests";
import { getTwitchBookmarks } from "@/utils/bookmarks";
import type { BookmarkNode, BookmarkStreams } from "@/types/bookmark";
import { TwitchStream } from "@/types/twitch";
import { StreamOptions, defaultOptions } from "@/types/options";
import {
  calculateStreamCounts,
  filterAndSortStreams,
} from "@/utils/streamUtils";

interface StreamStore {
  error: string | null;
  reset: () => void;

  twitchCredentials: TwitchCredentials;
  loadTwitchCredentials: () => Promise<void>;

  apiClient: APIClient | null;

  onlineStreams: Record<string, TwitchStream>;
  refreshOnlineStatus: () => Promise<void>;

  bookmarks: BookmarkNode[];
  loadBookmarks: () => Promise<void>;

  options: StreamOptions;
  setOptions: (options: Partial<StreamOptions>) => void;

  anyStreams: boolean;

  bookmarkAndFilteredStreams: BookmarkStreams | null;
  updateBookmarkAndFilteredStreams: () => void;
}

export const useStreamStore = create<StreamStore>()((set, get) => ({
  error: null,
  reset: () => {
    set({
      onlineStreams: {},
      bookmarks: [],
      error: null,
    });
  },

  twitchCredentials: {
    clientId: "",
    clientSecret: "",
  },
  loadTwitchCredentials: async () => {
    const result = await browser.storage.local.get("twitchCredentials");
    if (result.twitchCredentials) {
      set({ twitchCredentials: result.twitchCredentials });
    }
  },
  bookmarkAndFilteredStreams: null,
  apiClient: null,
  onlineStreams: {},
  refreshOnlineStatus: async () => {
    await get().loadTwitchCredentials();
    await get().loadBookmarks();
    const twitchCredentials = get().twitchCredentials;
    if (!twitchCredentials) return;

    const apiClient = await APIClient.getInstance(twitchCredentials);
    if (!apiClient) return;

    const usernames: string[] = [];
    const extractUsernames = (node: BookmarkNode) => {
      if (node.url?.includes("twitch.tv")) {
        usernames.push(node.title.toLowerCase());
      }
      node.children?.forEach(extractUsernames);
    };
    get().bookmarks.forEach(extractUsernames);

    if (usernames.length > 0) {
      const statuses = await apiClient.getStreamStatuses(usernames);
      set({ onlineStreams: statuses });
    }
    get().updateBookmarkAndFilteredStreams();
  },

  bookmarks: [],
  loadBookmarks: async () => {
    const bookmarksList = await getTwitchBookmarks();
    set({ bookmarks: bookmarksList });
  },

  options: defaultOptions,
  setOptions: (newOptions) => {
    set((state) => ({
      options: { ...state.options, ...newOptions },
    }));
    get().updateBookmarkAndFilteredStreams();
  },

  anyStreams: true,
  updateBookmarkAndFilteredStreams: () => {
    const state = get();

    const processBookmarkNode = (node: BookmarkNode): BookmarkStreams => {
      const streams: TwitchStream[] = [];
      let onlineCount = 0;
      let totalCount = 0;
      let filteredCount = 0;
      node.children
        ?.filter((child) => child.url?.includes("twitch.tv"))
        .forEach((child) => {
          totalCount++;

          const streamName = child.title.toLowerCase();
          const onlineStream = state.onlineStreams[streamName];
          const stream = {
            ...(onlineStream || { user_name: child.title }),
            user_login: streamName,
            isLive: !!onlineStream,
          };
          const shouldInclude =
            (!state.options.hideOfflineStreams || stream.isLive) &&
            (!state.options.searchTerm ||
              stream.user_name
                .toLowerCase()
                .includes(state.options.searchTerm.toLowerCase()) ||
              stream.title
                ?.toLowerCase()
                .includes(state.options.searchTerm.toLowerCase()) ||
              stream.game_name
                ?.toLowerCase()
                .includes(state.options.searchTerm.toLowerCase()));

          if (shouldInclude) {
            filteredCount++;
            streams.push(stream);
          }
          if (stream.isLive) onlineCount++;
        });

      // Process children
      const children = (node.children || [])
        .filter((child) => !child.url)
        .map(processBookmarkNode);

      // Add children counts
      children.forEach((child) => {
        onlineCount += child.onlineCount;
        totalCount += child.totalCount;
        filteredCount += child.filteredCount;
      });

      return {
        id: node.id,
        title: node.title,
        onlineCount,
        filteredCount,
        totalCount,
        streams,
        children: children.filter((child) => child.filteredCount > 0),
      };
    };

    // Traiter tous les dossiers racine
    const topLevelStreams: BookmarkNode = {
      id: "root",
      title: "All",
      children: state.bookmarks,
    };

    const bookmarkAndFilteredStreams = processBookmarkNode(topLevelStreams);

    set({ bookmarkAndFilteredStreams });
    set({
      anyStreams: bookmarkAndFilteredStreams.totalCount > 0,
    });
  },
}));
