import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";

const Popup = () => {
  browser.tabs.create({
    url: browser?.runtime?.getURL("/src/Streams/Streams.html"),
  });

  return null;
};

createRoot(document.body).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
