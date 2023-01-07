import { FC } from "react";
import { layoutKeys, LayoutKeys } from "./SelectLayout";

export interface Props {
  cy: cytoscape.Core | undefined;
  layout: LayoutKeys;
}

export const RelayoutButton: FC<Props> = ({ cy, layout }) => {
  return (
    <button
      id="mybutton"
      className="secondary"
      onClick={() => {
        if (layout && cy) {
          const selectedLayout = layoutKeys[layout];
          const cWithLayout = cy.layout(selectedLayout);
          cWithLayout.run();
        }
      }}
    >
      relayout
    </button>
  );
};
