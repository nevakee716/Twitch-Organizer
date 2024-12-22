import { AuthManager } from "./auth";
import type { TwitchCredentials } from "@/types/twitchCredential";
import { TwitchStream } from "@/types/twitch";
import { useStreamStore } from "@/Streams/Stores/useStore";

export class APIClient {
  private static instance: APIClient;
  private twitchCredentials: TwitchCredentials;
  private authManager: AuthManager;

  private constructor(
    twitchCredentials: TwitchCredentials,
    authManager: AuthManager
  ) {
    this.twitchCredentials = twitchCredentials;
    this.authManager = authManager;

    console.log("APIClient instance created");
  }

  static async getInstance(
    twitchCredentials?: TwitchCredentials
  ): Promise<APIClient> {
    if (
      twitchCredentials &&
      (!this.instance ||
        this.instance.twitchCredentials.clientId !== twitchCredentials.clientId)
    ) {
      const auth = await AuthManager.getInstance();
      this.instance = new APIClient(twitchCredentials, auth);
    }
    if (!this.instance) {
      throw new Error("APIClient not initialized");
    }
    return this.instance;
  }

  private async fetchWithAuth(endpoint: string): Promise<Response> {
    const token = await this.authManager.getToken(this.twitchCredentials);
    const response = await fetch(`https://api.twitch.tv/helix${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": this.twitchCredentials.clientId,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      useStreamStore.getState().setApiError(response.statusText);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response;
  }

  async getStreamStatuses(
    usernames: string[]
  ): Promise<Record<string, TwitchStream>> {
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
}
