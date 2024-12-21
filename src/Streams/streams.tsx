import React from "react";
import { createRoot } from "react-dom/client";
import { StreamList } from "./StreamList/StreamList";

export function App() {
  return <StreamList />;
}

function main() {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root element not found");
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

main();
