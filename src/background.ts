import browser from "webextension-polyfill";

console.log("Hello from the background!");

import getResponseBody from "./request/response";
import { sendMessageToContentScript } from "./request/message";
import { initBookmarks } from "@/utils/bookmarks";

// Initialiser les bookmarks au démarrage
initBookmarks();

// Ajouter l'initialisation au démarrage
browser.runtime.onInstalled.addListener(async (details) => {
  console.log("Extension installed:", details);
});

// Ajout de l'initialisation de l'environnement de développement
if (process.env.NODE_ENV === "development") {
  // Import dev config only in development
  import("./config/dev.config").then(({ devTwitchApps }) => {
    browser.storage.local.set({
      apps: devTwitchApps,
    });
  });

  browser.runtime.onInstalled.addListener((details) => {
    console.log("Extension installed:", details);
  });

  browser.tabs.create({
    url: browser.runtime.getURL("src/streams/streams.html"),
  });
}
const data: any = {};
console.log("Background Script Started");
browser.runtime.onMessage.addListener(
  (msg: string, sender, sendResponse: (response: any) => void) => {
    console.log(`Request Asked : ${msg}`);

    sendResponse(data[msg]);
  }
);
// scan sending request
browser.webRequest.onBeforeRequest.addListener(
  function (details: browser.WebRequest.OnBeforeRequestDetailsType) {
    console.log("Request Detected : " + details.url);
    if (details.url.includes("urlIwant")) {
      requestManager(details, "tags");
    }
  },
  { urls: ["<all_urls>"] },
  ["requestBody", "blocking"]
);

const requestManager = async (
  details: browser.WebRequest.OnBeforeRequestDetailsType,
  dataKey: any
) => {
  console.log(`${dataKey} Request Detected : ${details.requestId}`);
  data[dataKey] = await getResponseBody(details.requestId);
  console.log(data);
  return data[dataKey];
};

// later twitch on vertical screen
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("url change detected " + changeInfo.url);

  // read changeInfo data and do something with it (like read the url)
  if (changeInfo.url && changeInfo.url.includes("twitch.tv")) {
    let regex = /(https:\/\/.*?\/.*?\/)/;
    let result = changeInfo.url.match(regex);
    if (result) {
      data.url = result[0];
    }
  }

  // kpi page
  if (false && changeInfo?.url?.includes("")) {
    const regex = /\/([^\/]+)$/;
    const matches = changeInfo?.url?.match(regex);
    if (matches?.[1]) {
      const uuid = matches?.[1];
      let loading = setInterval(() => {
        browser.scripting
          .executeScript({
            target: { tabId: tab.id ?? 0 },
            func: () => {
              console.log("Parsing for KPI");
              let element = document.querySelector(
                "lx-json-editor"
              ) as HTMLElement;
              if (!element) return null;
              element.style.height =
                window.innerHeight - element.offsetTop - 242 + "px";
              (document.querySelector(".col-lg-6") as HTMLElement).style.width =
                "100%";
              return {
                name: (document.querySelector("#kpiName") as any).value,
                description: (document.querySelector("#kpiDescription") as any)
                  .value,
              };
            },
            args: [],
          })
          .then((injectionResults: any) => {
            for (const { frameId, result } of injectionResults) {
              if (result) {
                clearInterval(loading);
              }
            }
          });
      }, 500);
    }
  }
});
