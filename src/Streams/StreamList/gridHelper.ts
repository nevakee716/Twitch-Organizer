export const getGridClass = (columns: number): string => {
  const gridClasses: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
    13: "grid-cols-13",
    14: "grid-cols-14",
    15: "grid-cols-15",
    16: "grid-cols-16",
    17: "grid-cols-17",
    18: "grid-cols-18",
    19: "grid-cols-19",
    20: "grid-cols-20",
  };
  return gridClasses[columns] || "grid-cols-3";
};
