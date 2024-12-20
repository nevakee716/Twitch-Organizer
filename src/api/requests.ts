import { AuthManager } from "./auth";
import type { TwitchDevAppsInfo } from "@/utils/env";
import { TwitchStream } from "@/types/twitch";

export class APIClient {
  private static instance: APIClient;
  private environment: TwitchDevAppsInfo;
  private authManager: AuthManager;

  private constructor(
    environment: TwitchDevAppsInfo,
    authManager: AuthManager
  ) {
    this.environment = environment;
    this.authManager = authManager;
  }

  static async getInstance(
    environment?: TwitchDevAppsInfo
  ): Promise<APIClient> {
    if (
      environment &&
      (!this.instance || this.instance.environment.name !== environment.name)
    ) {
      const auth = await AuthManager.getInstance();
      this.instance = new APIClient(environment, auth);
    }
    if (!this.instance) {
      throw new Error("APIClient not initialized");
    }
    return this.instance;
  }

  private async fetchWithAuth(endpoint: string): Promise<Response> {
    const token = await this.authManager.getToken(this.environment);
    const response = await fetch(`https://api.twitch.tv/helix${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": this.environment.clientId,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response;
  }

  async getStreamStatuses(usernames: string[]): Promise<Record<string, TwitchStream>> {
    try {
      const chunks = [];
      for (let i = 0; i < usernames.length; i += 100) {
        chunks.push(usernames.slice(i, i + 100));
      }

      const allStreams: Record<string, TwitchStream> = {};

      for (const chunk of chunks) {
        const queryString = chunk.map((name) => `user_login=${name}`).join("&");
        const response = await this.fetchWithAuth(`/streams?${queryString}`);
        const data = await response.json();

        data.data.forEach((stream: TwitchStream) => {
          allStreams[stream.user_login.toLowerCase()] = stream;
        });
      }

      return allStreams;
    } catch (error) {
      console.error("Failed to fetch stream statuses:", error);
      throw error;
    }
  }

  // Ajoutez d'autres méthodes API ici
}
