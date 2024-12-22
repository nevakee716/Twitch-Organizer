import { TwitchStream } from "@/types/twitch";
import { UserIcon } from "lucide-react";

interface StreamCardFullProps {
  stream: TwitchStream;
  className?: string;
}

export const StreamCardFull: React.FC<StreamCardFullProps> = ({ stream, className }) => {
  return (
    <div
      className={`
        bg-twitch-bg-secondary 
        border border-twitch-border-default 
        rounded-lg 
        overflow-hidden 
        hover:border-twitch-border-hover 
        transition-colors 
        cursor-pointer
        ${className}
      `}
    >
      <img
        src={
          stream.thumbnail_url
            ? stream.thumbnail_url
                .replace("{width}", "320")
                .replace("{height}", "180")
            : `https://static-cdn.jtvnw.net/ttv-static/404_preview-320x180.jpg`
        }
        alt={stream.title || stream.user_name}
        className="w-full aspect-video object-cover"
      />

      <div className="p-3 space-y-2">
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

        {/* Troisième ligne: titre complet */}
        {stream.isLive && stream.title && (
          <div className="text-sm text-twitch-text-secondary break-words">
            {stream.title}
          </div>
        )}
      </div>
    </div>
  );
};
