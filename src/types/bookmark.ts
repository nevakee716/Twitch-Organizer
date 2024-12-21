import { TwitchStream } from "./twitch";

export interface BookmarkNode {
  id: string;
  title: string;
  url?: string;
  children?: BookmarkNode[];
}

export interface BookmarkStreams {
  id: string;
  title: string;
  onlineCount: number;
  filteredCount: number;
  totalCount: number;
  streams: TwitchStream[];
  children: BookmarkStreams[];
}
