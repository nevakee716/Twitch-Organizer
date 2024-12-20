import React from "react";
import { useStreamStore } from "../Stores/useStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TWITCH_THEME } from "@/config/theme";

export const StreamsPerRowControl = () => {
  const { streamsPerRow, setStreamsPerRow } = useStreamStore();

  return (
    <>
      <span className={`text-[${TWITCH_THEME.colors.text.primary}]`}>
        Streams per row:
      </span>
      <Select
        value={streamsPerRow.toString()}
        onValueChange={(value) => setStreamsPerRow(Number(value))}
      >
        <SelectTrigger
          className={`w-20 bg-[${TWITCH_THEME.colors.bg.secondary}] border-[${TWITCH_THEME.colors.border.default}]`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className={`bg-[${TWITCH_THEME.colors.bg.secondary}] border-[${TWITCH_THEME.colors.border.default}]`}
        >
          {[1, 3, 5, 7, 10].map((value) => (
            <SelectItem
              key={value}
              value={value.toString()}
              className={`text-[${TWITCH_THEME.colors.text.primary}] hover:bg-[${TWITCH_THEME.colors.bg.hover}]`}
            >
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
