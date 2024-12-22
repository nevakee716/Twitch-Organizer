import { Button } from "@/components/ui/button";
import browser from "webextension-polyfill";

interface StreamNoKeyProps {}

export const StreamNoKey = ({}: StreamNoKeyProps) => {
  const handleInitBookmarks = async () => {
    await browser.runtime.openOptionsPage();
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-center p-8">
      <p className="text-twitch-text-primary">
        Pour utiliser cette extension, vous devez remplir les informations d'api
        twitch dans les options de cette extension.
      </p>
      <Button
        onClick={handleInitBookmarks}
        variant="default"
        className="bg-twitch-border-active hover:bg-twitch-border-hover"
      >
        Ouvrir les options
      </Button>
    </div>
  );
};
