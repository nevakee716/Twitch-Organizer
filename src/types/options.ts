export interface StreamOptions {
  searchTerm: string;
  isCompactView: boolean;
  isExplorerView: boolean;
  hideOfflineStreams: boolean;
  streamsPerRow: number;
}

export const defaultOptions: StreamOptions = {
  searchTerm: "",
  isCompactView: false,
  isExplorerView: false,
  hideOfflineStreams: false,
  streamsPerRow: 3,
}; 