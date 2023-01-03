import { FC } from "react";
import {
  breadthfirstLayout,
  colaLayout,
  concentricLayout,
  dagreLayout,
  gridLayout,
} from "../layouts";

export const layoutKeys = {
  dagre: dagreLayout,
  cola: colaLayout,
  concentric: concentricLayout,
  grid: gridLayout,
  breadthfirst: breadthfirstLayout,
} as const;

export type LayoutKeys = keyof typeof layoutKeys;

export interface Props {
  cy: cytoscape.Core | undefined;
  layout: LayoutKeys;
  setLayout: (l: LayoutKeys) => void;
}

export const SelectLayout: FC<Props> = ({ cy, layout, setLayout }) => {
  return (
    <div>
      <select
        className="secondary"
        name="gedcom"
        id="gedcom"
        defaultValue={layout}
        onChange={(evt) => {
          if (evt.target.value && evt.target.value in layoutKeys) {
            const newKey = evt.target.value as LayoutKeys;
            const selectedLayout = layoutKeys[newKey];
            if (selectedLayout && cy) {
              const cWithLayout = cy.layout(selectedLayout);
              cWithLayout.run();
              setLayout(newKey);
            }
          } else if (layout && cy) {
            const selectedLayout = layoutKeys[layout];
            const cWithLayout = cy.layout(selectedLayout);
            cWithLayout.run();
          }
        }}
      >
        {Object.keys(layoutKeys).map((str) => {
          return (
            <option key={str} value={str}>
              {str}
            </option>
          );
        })}
      </select>
    </div>
  );
};
