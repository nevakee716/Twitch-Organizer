import browser from "webextension-polyfill";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TwitchDevAppsInfo } from "@/utils/env";

const OptionsPage = () => {
  const [twitchDevAppsInfo, setTwitchDevAppsInfo] = useState<
    TwitchDevAppsInfo[]
  >([]);

  // Load options from chrome storage on component mount
  useEffect(() => {
    const fetchData = async () => {
      let result = await browser.storage.local.get(["twitchDevAppsInfo"]);
      if (result.twitchDevAppsInfo)
        setTwitchDevAppsInfo(result.twitchDevAppsInfo);
    };

    fetchData();
  }, []);

  const handleAddTwitchDevAppsInfo = () => {
    const newTwitchDevAppsInfo = [
      ...twitchDevAppsInfo,
      { name: "", clientId: "", clientSecret: "" },
    ];
    setTwitchDevAppsInfo(newTwitchDevAppsInfo);
    browser.storage.local.set({ twitchDevAppsInfo: newTwitchDevAppsInfo });
  };

  const handleRemoveTwitchDevAppsInfo = (index: number) => {
    const newTwitchDevAppsInfo = [...twitchDevAppsInfo];
    newTwitchDevAppsInfo.splice(index, 1);
    setTwitchDevAppsInfo(newTwitchDevAppsInfo);
    browser.storage.local.set({ twitchDevAppsInfo: newTwitchDevAppsInfo });
  };

  const handleTwitchDevAppsInfoChange =
    (index: number, field: "name" | "clientId" | "clientSecret") =>
    (event: any) => {
      const newTwitchDevAppsInfo = [...twitchDevAppsInfo];
      newTwitchDevAppsInfo[index][field] = event.target.value;
      setTwitchDevAppsInfo(newTwitchDevAppsInfo);
      browser.storage.local.set({ twitchDevAppsInfo: newTwitchDevAppsInfo });
    };

  return (
    <div className="w-full">
      <Tabs defaultValue="twitch" className="w-full">
        <TabsList>
          <TabsTrigger value="twitch">Twitch</TabsTrigger>
        </TabsList>

        <TabsContent value="twitch">
          {twitchDevAppsInfo.map((key, index) => (
            <div className="flex items-center justify-between">
              <Input
                type="text"
                placeholder={`Name`}
                value={key.name}
                onChange={handleTwitchDevAppsInfoChange(index, "name")}
              />
              <Input
                type="text"
                placeholder={`Client ID`}
                value={key.clientId}
                onChange={handleTwitchDevAppsInfoChange(index, "clientId")}
              />
              <Input
                type="text"
                placeholder={`Client Secret`}
                value={key.clientSecret}
                onChange={handleTwitchDevAppsInfoChange(index, "clientSecret")}
              />
              <Button
                variant="secondary"
                onClick={() => handleRemoveTwitchDevAppsInfo(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          <div>
            <Button variant="default" onClick={handleAddTwitchDevAppsInfo}>
              Add Twitch Key
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

createRoot(document.body).render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>
);
