import { Button } from "@/components/ui/button";
import browser from "webextension-polyfill";

interface StreamListApiErrorProps {}

export const StreamListApiError = ({}: StreamListApiErrorProps) => {
  const handleButtonClick = async () => {
    await browser.runtime.openOptionsPage();
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-center p-8">
      <p className="text-twitch-text-primary">
        Il y a eu une erreur lors de la récupération des streams. Veuillez
        vérifier vos informations d'api twitch dans les options de cette
        extension.
      </p>
      <Button
        onClick={handleButtonClick}
        variant="default"
        className="bg-twitch-border-active hover:bg-twitch-border-hover"
      >
        Ouvrir les options
      </Button>
    </div>
  );
};
