import React from "react";
import { TwitchStream } from "@/types/twitch";
import { TWITCH_THEME } from "@/config/theme";
import { UserIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StreamCardCompactProps {
  stream: TwitchStream;
  className?: string;
}

export const StreamCardCompact: React.FC<StreamCardCompactProps> = ({
  stream,
  className,
}) => {
  return (
    <div
      className={`
        bg-twitch-bg-secondary 
        border border-twitch-border-active 
        rounded-lg 
        overflow-hidden 
        hover:border-twitch-border-hover
        hover:bg-twitch-bg-primary
        transition-colors 
        p-3 
        cursor-pointer
        space-y-1
        ${className}
      `}
    >
      {/* Première ligne: nom du stream et viewers */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-twitch-text-primary">
            {stream.user_name}
          </span>
        </div>
        {stream.isLive ? (
          <div className="flex items-center gap-1 ml-auto">
            <span className="flex items-center gap-1 text-sm text-twitch-text-secondary">
              <UserIcon className="w-4 h-4" />
              {stream.viewer_count?.toLocaleString()}
            </span>
          </div>
        ) : (
          <span className="text-sm text-twitch-text-secondary ml-auto">
            Offline
          </span>
        )}
      </div>

      {/* Deuxième ligne: jeu */}
      {stream.isLive && stream.game_name && (
        <div className="text-sm font-medium text-twitch-text-secondary">
          {stream.game_name}
        </div>
      )}

      {/* Troisième ligne: titre avec tooltip */}
      {stream.isLive && stream.title && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm text-twitch-text-secondary truncate">
                {stream.title}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[300px] whitespace-normal">{stream.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
