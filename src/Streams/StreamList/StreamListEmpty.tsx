import { Button } from "@/components/ui/button";
import { initBookmarks } from "@/utils/bookmarks";
import { useStreamStore } from "../Stores/useStore";
import { useState } from "react";

interface StreamListEmptyProps {}

export const StreamListEmpty = ({}: StreamListEmptyProps) => {
  const { refreshOnlineStatus } = useStreamStore();
  const [isLoading, setIsLoading] = useState(false);
  const handleInitBookmarks = async () => {
    setIsLoading(true);
    await initBookmarks();
    await refreshOnlineStatus();
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-center p-8">
      <p className="text-twitch-text-primary">
        Pour utiliser cette extension, vous devez ajouter vos streams Twitch
        favoris dans le dossier "TwitchOrganizer".
      </p>
      <p className="text-twitch-text-primary">
        Vous pouvez utiliser des sous-dossiers pour organiser vos streams.
      </p>
      <Button
        onClick={handleInitBookmarks}
        disabled={isLoading}
        variant="default"
        className="bg-twitch-border-active hover:bg-twitch-border-hover"
      >
        {isLoading ? "Initialisation..." : "Initialiser les bookmarks"}
      </Button>
    </div>
  );
};
