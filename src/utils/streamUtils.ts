import { BookmarkNode } from "@/types/bookmark";
import { TwitchStream } from "@/types/twitch";

export interface StreamCounts {
  online: number;
  total: number;
}

export const calculateStreamCounts = (
  node: BookmarkNode,
  onlineStreams: Record<string, TwitchStream>
): StreamCounts => {
  let counts = { online: 0, total: 0 };

  const processNode = (node: BookmarkNode) => {
    if (node.url?.includes("twitch.tv")) {
      counts.total++;
      if (onlineStreams[node.title.toLowerCase()]) {
        counts.online++;
      }
    }
    // Ajouter récursivement les compteurs des sous-dossiers
    node.children?.forEach(processNode);
  };

  processNode(node);
  return counts;
};

export const filterAndSortStreams = (
  streams: TwitchStream[],
  searchTerm: string = "",
  hideOffline: boolean = false
): TwitchStream[] => {
  return streams
    .filter((stream) => {
      if (hideOffline && !stream.isLive) return false;
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        stream.user_name.toLowerCase().includes(searchLower) ||
        stream.title?.toLowerCase().includes(searchLower) ||
        stream.game_name?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (a.isLive === b.isLive) return 0;
      return a.isLive ? -1 : 1;
    });
};

export const getAllStreamsInFolder = (
  folder: BookmarkNode,
  onlineStreams: Record<string, TwitchStream>
): TwitchStream[] => {
  const streamInTheFolder: string[] = [];

  const processNode = (node: BookmarkNode) => {
    if (node.url?.includes("twitch.tv")) {
      const streamName = node.title.toLowerCase();
      streamInTheFolder.push(streamName);
    }
    node.children?.forEach(processNode);
  };

  processNode(folder);

  return Object.entries(onlineStreams)
    .filter(([streamName]) => streamInTheFolder.includes(streamName))
    .map(([streamName, stream]) => ({
      ...stream,
      isLive: true,
      user_name: stream.user_name || streamName,
      user_login: streamName,
    }));
};
