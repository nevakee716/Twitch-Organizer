import { Button } from "@/components/ui/button";
import { initBookmarks } from "@/utils/bookmarks";
import { useStreamStore } from "../Stores/useStore";

interface StreamListEmptyProps {
  isInitializing: boolean;
}

export const StreamListEmpty = ({ isInitializing }: StreamListEmptyProps) => {
  const store = useStreamStore();
  const handleInitBookmarks = () => {
    initBookmarks();
    store.updateBookmarkAndFilteredStreams();
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-center p-8">
      <p className="text-twitch-text-primary">
        Pour utiliser cette extension, vous devez ajouter vos streams Twitch
        favoris dans le dossier "TwitchOrganizer".
      </p>
      <Button
        onClick={handleInitBookmarks}
        disabled={isInitializing}
        variant="default"
        className="bg-twitch-brand-primary hover:bg-twitch-brand-secondary"
      >
        {isInitializing ? "Initialisation..." : "Initialiser les bookmarks"}
      </Button>
    </div>
  );
};
