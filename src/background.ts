import browser from "webextension-polyfill";

console.log("Hello from the background!");

import getResponseBody from "./request/response";
import { initBookmarks } from "@/utils/bookmarks";

// Initialiser les bookmarks au démarrage
initBookmarks();

// Code de développement qui sera exclu en production
if (import.meta.env.DEV) {
  // Import dev config only in development
  import("./config/dev.config").then(({ devTwitchApps }) => {
    browser.storage.local.set({
      apps: devTwitchApps,
    });
  });

  browser.tabs.create({
    url: browser.runtime.getURL("src/Streams/Streams.html"),
  });
}
