import type { TwitchDevAppsInfo } from "@/utils/env";
import browser from "webextension-polyfill";
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
    }
    return this.instance;
  }

  private async fetchToken(
    environment: TwitchDevAppsInfo
  ): Promise<TokenResponse> {
    const tokenUrl = "https://id.twitch.tv/oauth2/token";
    
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: environment.clientId,
        client_secret: environment.clientSecret,
        grant_type: "client_credentials"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch token (${response.status}): ${errorText}`);
    }

    const data: TokenResponse = await response.json();
    return data;
  }

  async getToken(environment: TwitchDevAppsInfo): Promise<string> {
    const key = environment.clientId;
    const tokenData = this.tokenMap.get(key);

    if (!tokenData || !tokenData.token || tokenData.expiry < new Date()) {
      const tokenResponse = await this.fetchToken(environment);
      const newTokenData = {
        token: tokenResponse.access_token,
        expiry: new Date(Date.now() + tokenResponse.expires_in * 1000),
      };
      this.tokenMap.set(key, newTokenData);

      return newTokenData.token;
    }

    return tokenData.token;
  }

  clearToken(environment: TwitchDevAppsInfo): void {
    this.tokenMap.delete(environment.clientId);
  }
}
