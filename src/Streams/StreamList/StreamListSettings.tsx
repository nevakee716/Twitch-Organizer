import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useStreamStore } from "../Stores/useStore";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface StreamListSettingsProps {}

export const StreamListSettings = ({}: StreamListSettingsProps) => {
  const { options, setOptions } = useStreamStore();

  return (
    <div className="flex items-center gap-4">
      <Input
        type="text"
        placeholder="Search streams..."
        value={options.searchTerm}
        onChange={(e) => setOptions({ searchTerm: e.target.value })}
        className="w-64 bg-twitch-bg-secondary border-twitch-border-default text-twitch-text-primary placeholder:text-twitch-text-secondary"
      />
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Label
            htmlFor="compact-view"
            className="text-sm text-twitch-text-primary"
          >
            Compact
          </Label>
          <Switch
            id="compact-view"
            checked={options.isCompactView}
            onCheckedChange={(value) => setOptions({ isCompactView: value })}
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center space-x-2">
          <Label
            htmlFor="hide-offline"
            className="text-sm text-twitch-text-primary"
          >
            En ligne
          </Label>
          <Switch
            id="hide-offline"
            checked={options.hideOfflineStreams}
            onCheckedChange={(value) =>
              setOptions({ hideOfflineStreams: value })
            }
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center space-x-2">
          <Label
            htmlFor="explorer-view"
            className="text-sm text-twitch-text-primary"
          >
            Explorer
          </Label>
          <Switch
            id="explorer-view"
            checked={options.isExplorerView}
            onCheckedChange={(value) => setOptions({ isExplorerView: value })}
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center space-x-2">
          <Label
            htmlFor="streams-per-row"
            className="text-sm text-twitch-text-primary"
          >
            Colonnes
          </Label>
          <Select
            value={options.streamsPerRow.toString()}
            onValueChange={(value) =>
              setOptions({ streamsPerRow: parseInt(value) })
            }
          >
            <SelectTrigger
              id="streams-per-row"
              className="w-16 h-8 text-sm bg-twitch-bg-secondary border-twitch-border-default"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 8, 10].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
