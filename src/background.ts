import browser from "webextension-polyfill";
import { useStreamStore } from "@/Streams/Stores/useStore";
console.log("Hello from the background!");

// Code de développement qui sera exclu en production
if (import.meta.env.DEV) {
  // Import dev config only in development
  import("./config/dev.config").then(({ devTwitchApps }) => {
    browser.storage.local.set({
      twitchCredentials: devTwitchApps,
    });
  });

  browser.tabs.create({
    url: browser.runtime.getURL("src/Streams/Streams.html"),
  });
}

setInterval(async () => {
  await useStreamStore.getState().refreshOnlineStatus();
  const bookmarkStreams = useStreamStore.getState().bookmarkAndFilteredStreams;
  const onlineCount = bookmarkStreams?.onlineCount || 0;
  console.log("onlineCount", onlineCount);
  browser.browserAction.setBadgeText({ text: onlineCount.toString() || "0" });
}, 60 * 1000);
