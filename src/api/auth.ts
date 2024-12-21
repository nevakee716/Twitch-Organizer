import type { TwitchCredentials } from "@/types/twitchCredential";
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export class AuthManager {
  private static instance: AuthManager;
  private tokenMap: Map<string, { token: string; expiry: Date }> = new Map();

  static async getInstance(): Promise<AuthManager> {
    if (!this.instance) {
      this.instance = new AuthManager();
      console.log("AuthManager instance created");
    }
    return this.instance;
  }

  private async fetchToken(
    twitchCredentials: TwitchCredentials
  ): Promise<TokenResponse> {
    const tokenUrl = "https://id.twitch.tv/oauth2/token";

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: twitchCredentials.clientId,
        client_secret: twitchCredentials.clientSecret,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch token (${response.status}): ${errorText}`
      );
    }

    const data: TokenResponse = await response.json();
    return data;
  }

  async getToken(twitchCredentials: TwitchCredentials): Promise<string> {
    const key = twitchCredentials.clientId;
    const tokenData = this.tokenMap.get(key);

    if (!tokenData || !tokenData.token || tokenData.expiry < new Date()) {
      const tokenResponse = await this.fetchToken(twitchCredentials);
      const newTokenData = {
        token: tokenResponse.access_token,
        expiry: new Date(Date.now() + tokenResponse.expires_in * 1000),
      };
      this.tokenMap.set(key, newTokenData);

      return newTokenData.token;
    }

    return tokenData.token;
  }

  clearToken(twitchCredentials: TwitchCredentials): void {
    this.tokenMap.delete(twitchCredentials.clientId);
  }
}
