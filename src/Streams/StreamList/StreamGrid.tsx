import React from "react";
import { TwitchStream } from "@/types/twitch";

import { getGridClass } from "./gridHelper";
import { useStreamStore } from "../Stores/useStore";
import { StreamCardFull } from "./StreamCardFull";
import { StreamCardCompact } from "./StreamCardCompact";

export const StreamGrid: React.FC = () => {
  const { options, getFilteredStreams } = useStreamStore();
  const streams = getFilteredStreams();

  const handleClick = (stream: TwitchStream) => {
    window.open(`https://twitch.tv/${stream.user_name}`, "_blank");
  };

  return (
    <div className={`grid ${getGridClass(options.streamsPerRow)} gap-4`}>
      {streams.map((stream) => (
        <div key={stream.user_login} onClick={() => handleClick(stream)}>
          {options.isCompactView ? (
            <StreamCardCompact stream={stream} />
          ) : (
            <StreamCardFull stream={stream} />
          )}
        </div>
      ))}
      {streams.length === 0 && (
        <div className="text-twitch-text-secondary col-span-full text-center">
          Aucun stream en ligne dans ce dossier
        </div>
      )}
    </div>
  );
};
