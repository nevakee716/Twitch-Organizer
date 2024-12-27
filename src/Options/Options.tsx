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

      <div className="space-y-4 text-sm text-gray-500">
        <p>Pour obtenir vos clés d'API Twitch, suivez ces étapes :</p>

        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Rendez-vous sur{" "}
            <a
              href="https://dev.twitch.tv/console/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-twitch-brand-primary hover:underline"
            >
              la console développeur Twitch
            </a>
          </li>

          <li>Cliquez sur "Enregistrer votre application"</li>

          <li>
            Remplissez le formulaire :
            <ul className="list-disc pl-5 mt-1">
              <li>
                Nom : Choisissez un nom pour votre application (ex: "Mon
                Extension Twitch")
              </li>
              <li>
                URLs de redirection OAuth :
                <ul className="list-disc pl-5 mt-1">
                  <li>Entrez simplement : http://localhost</li>
                  <li>
                    Cette URL ne sera pas utilisée mais est requise par Twitch
                  </li>
                  <li>
                    <strong>NE PAS cliquer sur ajouter</strong>
                  </li>
                </ul>
              </li>
              <li>Catégorie : Sélectionnez "Browser Extension"</li>
            </ul>
          </li>

          <li>Cliquez sur "Créer"</li>

          <li>Une fois créée, cliquez sur "Gérer" sur votre application</li>

          <li>
            Sur la page de gestion, vous trouverez :
            <ul className="list-disc pl-5 mt-1">
              <li>L'ID Client est affiché directement sur la page</li>
              <li>Pour le Secret Client, cliquez sur "Nouveau secret"</li>
              <li>
                ⚠️ Copiez immédiatement le Secret Client car il ne sera plus
                visible après
              </li>
            </ul>
          </li>
        </ol>

        <p className="mt-4 text-yellow-600">
          ⚠️ Important : Ces informations sont sensibles, ne les partagez jamais
          et ne les commettez pas dans votre code.
        </p>
      </div>
    </div>
  );
};

createRoot(document.body).render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>
);
