import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Streams } from "./Pages/Streams";
import browser from "webextension-polyfill";

const Popup = () => {
  const [whatToLoad, setWhatToLoad] = useState("");

  const analyzeUrl = async () => {
    let tabs = await browser.tabs.query({ currentWindow: true, active: true });
    let tab = tabs[0];

    if (tab.url?.includes("twitch.tv")) {
      setWhatToLoad("streams");
    } else if (tab.url?.includes("about:newtab") || true) {
      browser.tabs.create({ url: browser?.runtime?.getURL("Streams.html") });
    }
  };

  useEffect(() => {
    analyzeUrl();
  }, []);

  switch (whatToLoad) {
    case "streams":
      return <Streams />;
    default:
      return <>Nothing to load</>;
  }
};

createRoot(document.body).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
