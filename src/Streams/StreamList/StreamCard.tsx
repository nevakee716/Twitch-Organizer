import React from "react";
import { TwitchStream } from "@/types/twitch";
import { useStreamStore } from "@/Streams/Stores/useStore";
import { StreamCardCompact } from "./StreamCardCompact";
import { StreamCardFull } from "./StreamCardFull";

interface StreamCardProps {
  stream: TwitchStream & { isLive: boolean };
}

export const StreamCard = ({ stream }: StreamCardProps) => {
  const { isCompactView } = useStreamStore();

  const handleClick = () => {
    window.open(`https://twitch.tv/${stream.user_name}`, "_blank");
  };

  return isCompactView ? (
    <StreamCardCompact stream={stream} onClick={handleClick} />
  ) : (
    <StreamCardFull stream={stream} onClick={handleClick} />
  );
};
