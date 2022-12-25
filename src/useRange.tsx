import {
  CollectionReturnValue,
  EdgeDefinition,
  NodeDefinition,
} from "cytoscape";
import { useState } from "react";
import { getMinMaxDate } from "./getMinMaxDate";
import Slider from "rc-slider";

export const useRange = (cy: cytoscape.Core | undefined) => {
  const [range, setRange] = useState<number | number[]>([-Infinity, Infinity]);
  const [removed, setRemoved] = useState<CollectionReturnValue>();
  const [minMaxDate, setMinMaxDate] = useState<[number, number]>([
    -Infinity,
    Infinity,
  ]);

  const initMinMax = (elements: (NodeDefinition | EdgeDefinition)[]) => {
    const minMaxDate = getMinMaxDate(elements);
    setMinMaxDate(minMaxDate);
    setRange(minMaxDate);
  };

  const handleRangeChange = (val: number | number[]) => {
    setRange(val);
    if (removed) {
      removed.restore();
    }
    if (typeof val === "object" && val[0] && cy) {
      // const result = cy.$(`[birthYear < ${val[0]}]`).remove();
      const result = cy
        .filter((elem) => {
          if (!elem.isNode()) {
            return false;
          }
          if (elem.data("birthYear") < val[0]) {
            return true;
          }
          if (elem.data("deathYear") > val[1]) {
            return true;
          }
          return false;
          // return elem.isNode() && elem.data("birthYear") < val[0] ;
        })
        .remove();
      // console.log(x);
      setRemoved(result);
    }
  };

  const rangeSlider = (
    <div style={{ width: 300 }}>
      <Slider
        range
        allowCross={false}
        min={minMaxDate[0]}
        max={minMaxDate[1]}
        defaultValue={range}
        value={range}
        onChange={handleRangeChange}
      />
      {typeof range === "object" ? `from ${range[0]} to ${range[1]}` : ""}
    </div>
  );

  return { initMinMax, rangeSlider };
};
