import { NavigationMainMenu } from "@/components/Menu";
import { HashRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { useStreamStore } from "./Stores/useStore";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TwitchDevAppsInfo } from "@/utils/env";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StreamList } from "./StreamList/StreamList";
if (import.meta.hot) {
  import.meta.hot.accept();
}

interface TwitchDevAppsSelectProps {
  apps: TwitchDevAppsInfo[];
  selectedApp: TwitchDevAppsInfo | null;
  setSelectedApp: (app: TwitchDevAppsInfo | null) => void;
}

const TwitchDevAppsSelect = ({
  apps,
  selectedApp,
  setSelectedApp,
}: TwitchDevAppsSelectProps) => {
  if (apps.length === 0) {
    return (
      <Alert variant="destructive">
        <Icon icon="lucide:triangle-alert" className="h-4 w-4" />
        <AlertTitle>No apps available.</AlertTitle>
      </Alert>
    );
  }

  return (
    <Select
      value={selectedApp?.name}
      onValueChange={(value) => {
        const app = apps.find((a) => a.name === value);
        setSelectedApp(app || null);
      }}
    >
      <SelectTrigger label="App" className="w-[200px]">
        <SelectValue placeholder="Select app" />
      </SelectTrigger>
      <SelectContent>
        {apps.map((app) => (
          <SelectItem key={app.name} value={app.name}>
            {app.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const StreamsCounter = ({ count }: { count: number }) => (
  <Badge variant="secondary" className="flex items-center gap-2 h-9 px-4">
    <Icon icon="lucide:files" className="h-4 w-4" />
    <span>
      {count} {count === 1 ? "stream" : "streams"}
    </span>
  </Badge>
);

const LanguageSelect = () => {
  const { selectedLanguage, setSelectedLanguage } = useStreamStore();

  const languages = [
    { value: "EN", label: "English" },
    { value: "FR", label: "Français" },
  ] as const;

  return (
    <Select
      value={selectedLanguage}
      onValueChange={(value) =>
        setSelectedLanguage(value as typeof selectedLanguage)
      }
    >
      <SelectTrigger label="Language" className="w-[130px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const Layout = () => {
  const {
    apps,
    selectedApp,
    setSelectedApp,
    loadApps,
    refreshOnlineStatus,
    onlineStreams,
  } = useStreamStore();

  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    console.log("Streams changed", onlineStreams);
  }, [onlineStreams]);

  return (
    <>
      {false && (
        <div className="flex justify-between items-center p-4 border-b">
          <NavigationMainMenu />
          <TooltipProvider>
            <div className="flex items-center gap-4">
              <LanguageSelect />
              <div className="flex gap-2">
                <TwitchDevAppsSelect
                  apps={apps}
                  selectedApp={selectedApp}
                  setSelectedApp={setSelectedApp}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => refreshOnlineStatus()}
                      className="h-9 w-9"
                    >
                      <Icon icon="lucide:refresh-cw" className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh streams</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <StreamsCounter count={Object.keys(onlineStreams).length} />
            </div>
          </TooltipProvider>
        </div>
      )}
      <Outlet />
    </>
  );
};

export function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StreamList />} />
          <Route path="/admin" element={<div>To be implemented</div>} />
        </Route>
      </Routes>
    </Router>
  );
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
