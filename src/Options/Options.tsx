import browser from "webextension-polyfill";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TwitchCredentials {
  clientId: string;
  clientSecret: string;
}

const OptionsPage = () => {
  const [credentials, setCredentials] = useState<TwitchCredentials>({
    clientId: "",
    clientSecret: "",
  });

  // Load credentials from storage on component mount
  useEffect(() => {
    const loadCredentials = async () => {
      const result = await browser.storage.local.get(["twitchCredentials"]);
      if (result.twitchCredentials) {
        setCredentials(result.twitchCredentials);
      }
    };
    loadCredentials();
  }, []);

  const handleChange =
    (field: keyof TwitchCredentials) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCredentials = {
        ...credentials,
        [field]: event.target.value,
      };
      setCredentials(newCredentials);
      browser.storage.local.set({ twitchCredentials: newCredentials });
    };

  return (
    <div className="container max-w-2xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Twitch API Configuration</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client ID</Label>
          <Input
            id="clientId"
            type="text"
            value={credentials.clientId}
            onChange={handleChange("clientId")}
            placeholder="Enter your Twitch Client ID"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientSecret">Client Secret</Label>
          <Input
            id="clientSecret"
            type="password"
            value={credentials.clientSecret}
            onChange={handleChange("clientSecret")}
            placeholder="Enter your Twitch Client Secret"
            className="w-full"
          />
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Ces informations sont nécessaires pour accéder à l'API Twitch. Vous
        pouvez les obtenir en créant une application sur{" "}
        <a
          href="https://dev.twitch.tv/console/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="text-twitch-brand-primary hover:underline"
        >
          la console développeur Twitch
        </a>
        .
      </div>
    </div>
  );
};

createRoot(document.body).render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>
);
