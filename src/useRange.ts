import { CollectionReturnValue } from "cytoscape";
import { useState } from "react";

export const useRange = (cy: cytoscape.Core | undefined) => {
  const [range, setRange] = useState<number | number[]>([-Infinity, Infinity]);
  const [removed, setRemoved] = useState<CollectionReturnValue>();

  const handleRangeChange = (val: number | number[]) => {
    setRange(val);
    if (removed) {
      removed.restore();
    }
    if (typeof val === "object" && val[0] && cy) {
      const result = cy.$(`[birthYear < ${val[0]}]`).remove();
      setRemoved(result);
    }
  };

  return { handleRangeChange, range, setRange };
};
