import { LayoutOptions } from "cytoscape";
import { FC } from "react";
import {
  dagreLayout,
  colaLayout,
  concentricLayout,
  gridLayout,
  breadthfirstLayout,
} from "../layouts";

export interface Props {
  cy: cytoscape.Core | undefined;
  setLayout: (l: LayoutOptions) => void;
}

const selectOptions: Record<string, LayoutOptions> = {
  dagre: dagreLayout,
  cola: colaLayout,
  concentric: concentricLayout,
  grid: gridLayout,
  breadthfirst: breadthfirstLayout,
} as const;

export const SelectLayout: FC<Props> = ({ cy, setLayout }) => {
  return (
    <div>
      <select
        className="secondary"
        name="gedcom"
        id="gedcom"
        onChange={(evt) => {
          if (evt.target.value) {
            const selectedLayout = selectOptions[evt.target.value];
            if (selectedLayout && cy) {
              const cWithLayout = cy.layout(selectedLayout);
              cWithLayout.run();
              setLayout(selectedLayout);
            }
          }
        }}
      >
        {Object.keys(selectOptions).map((str) => {
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
