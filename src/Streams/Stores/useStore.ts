// stores/useFileStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import browser from "webextension-polyfill";
import type { TwitchDevAppsInfo } from "@/utils/env";
import { APIClient } from "@/api/requests";
import { get, set, del } from "idb-keyval";
import { getTwitchBookmarks } from "@/utils/bookmarks";
import type { BookmarkNode } from "@/utils/bookmarks";
import { TwitchStream } from "@/types/twitch";

export interface StoredState {
  streams: TwitchDevAppsInfo[];
}

interface StreamStore {
  // State
  isProcessing: boolean;
  progress: number;
  error: string | null;

  defaultSettings: {
    valueThreshold: number;
    textareaThreshold: number;
    headerRowIndex: number;
    dataStartRowIndex: number;
  };
  // Actions
  reset: () => void;
  savedStates: { [key: string]: Omit<StreamStore, "savedStates"> };

  // Ajout des propriétés pour l'environnement
  selectedApp: TwitchDevAppsInfo | null;
  apps: TwitchDevAppsInfo[];

  // Ajout des actions pour l'environnement
  setSelectedApp: (app: TwitchDevAppsInfo | null) => void;
  loadApps: () => Promise<void>;

  apiClient: APIClient | null;

  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;

  // Nouveau state pour les streams en ligne
  onlineStreams: Record<string, TwitchStream>;
  bookmarks: BookmarkNode[];

  // Nouvelles actions
  loadBookmarks: () => Promise<void>;
  refreshOnlineStatus: () => Promise<void>;

  streamsPerRow: number;
  setStreamsPerRow: (value: number) => void;

  isCompactView: boolean;
  setCompactView: (value: boolean) => void;
}

export const DEFAULT_SETTINGS = {
  valueThreshold: 10,
  textareaThreshold: 50,
  headerRowIndex: 0,
  dataStartRowIndex: 0,
};

console.log("Creating store");
export const useStreamStore = create<StreamStore>()(
  persist(
    (set, get) => ({
      streams: [],
      isProcessing: false,
      progress: 0,
      error: null,

      defaultSettings: DEFAULT_SETTINGS,
      savedStates: {},

      selectedApp: null,
      apps: [],

      setSelectedApp: async (app) => {
        console.log("setSelectedApp", app?.clientId);
        if (app) {
          set({ selectedApp: app });
          let newApiClient = await APIClient.getInstance(app);
          console.log("newApiClient", newApiClient);
          set({
            apiClient: newApiClient,
          });
          await get().refreshOnlineStatus();
        }
      },
      loadApps: async () => {
        try {
          const result = await browser.storage.local.get("apps");
          if (result.apps) {
            set({ apps: result.apps });
            // Si aucun environnement n'est sélectionné, sélectionner le premier
            if (!get().selectedApp && result.apps.length > 0) {
              get().setSelectedApp(result.apps[0]);
            }
          }
        } catch (error) {
          console.error("Failed to load environments:", error);
        }
      },

      selectedLanguage: "EN",
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),

      reset: () => {
        set({
          onlineStreams: {},
          bookmarks: [],
          error: null,
        });
      },

      apiClient: null,

      onlineStreams: {} as Record<string, TwitchStream>,
      bookmarks: [],

      loadBookmarks: async () => {
        const bookmarksList = await getTwitchBookmarks();
        set({ bookmarks: bookmarksList });
      },

      refreshOnlineStatus: async () => {
        const app = get().selectedApp;
        if (!app) return;

        const apiClient = await APIClient.getInstance(app);
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
      },

      streamsPerRow: 3,
      setStreamsPerRow: (value: number) => set({ streamsPerRow: value }),

      isCompactView: false,
      setCompactView: (value: boolean) => set({ isCompactView: value }),
    }),
    {
      name: "file-storage",
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          try {
            const value = await get(name);
            return value ?? null;
          } catch (error) {
            console.error(`Error reading from IndexedDB:`, error);
            return null;
          }
        },
        setItem: async (name: string, value: any) => {
          try {
            await set(name, value);
          } catch (error) {
            console.error(`Error writing to IndexedDB:`, error);
            throw error;
          }
        },
        removeItem: async (name: string) => {
          try {
            await del(name);
          } catch (error) {
            console.error(`Error removing from IndexedDB:`, error);
          }
        },
      })),
      partialize: (state) => ({
        ...state,
        selectedApp: state.selectedApp,
      }),
    }
  )
);
