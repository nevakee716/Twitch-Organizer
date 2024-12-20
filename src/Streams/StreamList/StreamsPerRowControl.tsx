import React from "react";
import { useStreamStore } from "../Stores/useStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const StreamsPerRowControl = () => {
  const { streamsPerRow, setStreamsPerRow } = useStreamStore();

  return (
    <>
      <span className="text-twitch-text-primary">
        Streams per row:
      </span>
      <Select
        value={streamsPerRow.toString()}
        onValueChange={(value) => setStreamsPerRow(Number(value))}
      >
        <SelectTrigger
          className="
            w-20 
            bg-twitch-bg-secondary 
            border-twitch-border-default
            text-twitch-text-primary
          "
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className="
            bg-twitch-bg-secondary 
            border-twitch-border-default
          "
        >
          {[1, 3, 5, 7, 10].map((value) => (
            <SelectItem
              key={value}
              value={value.toString()}
              className="
                text-twitch-text-primary 
                hover:bg-twitch-bg-hover
                data-[state=checked]:bg-twitch-bg-hover
              "
            >
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
