import cytoscape, {
  EdgeDefinition,
  NodeDefinition,
  NodeSingular,
} from "cytoscape";
import { ReactElement, useEffect } from "react";
import "./App.css";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { getStyle } from "./graph/style";
import { loadGedcom } from "./loadGedcom";
import { logLoaded } from "./util/readFile";
import { onTapNode } from "./onTapNode";
import { layoutKeys, LayoutKeys } from "./actions/SelectLayout";

interface Props {
  cy?: cytoscape.Core;
  setCy: (_: cytoscape.Core) => void;
  gedcomPath: string;
  setSources: (_: Record<string, string>) => void;
  layout: LayoutKeys;
  setDetails: (_: ReactElement) => void;
  initMinMax: (_: (NodeDefinition | EdgeDefinition)[]) => void;
}

export const useLoadGedcomToGraph = ({
  cy,
  gedcomPath,
  initMinMax,
  layout,
  setCy,
  setDetails,
  setSources,
}: Props) => {
  useEffect(() => {
    const run = async () => {
      const { elements, ...gedcom } = await loadGedcom(gedcomPath);

      logLoaded(gedcomPath, elements);

      setSources(gedcom.sources);
      initMinMax(elements);

      const newCy = cytoscape({
        container: document.getElementById("cy"), // container to render in
        elements,
        style: getStyle({ images: gedcom.images }),
        layout: layoutKeys[layout],
      });

      setCy(newCy);

      newCy.on(
        "tap",
        "node",
        onTapNode({
          setDetails,
          sources: gedcom.sources,
          images: gedcom.images,
        })
      );

      newCy.on("mouseover", "node", (evt) => {
        const target: NodeSingular = evt.target;
        // const node = target[0]._private.data;
        // console.log("tapped ", node.name);

        // newCy
        //   .elements()
        //   .difference(target.outgoers())
        //   .not(target)
        //   .addClass("semitransp");
        // target.addClass("highlight").outgoers().addClass("highlight");
        target.addClass("highlight").neighborhood().addClass("highlight");
      });

      newCy.on("mouseout", "node", (evt) => {
        //select either edges or nodes to remove the styles
        //var edges = cy.edges();
        //var nodes = cy.nodes()
        // edges.removeClass('semitransp');
        // nodes.removeClass('semitransp');
        //you can select all elements and remove the styles
        newCy.elements().removeClass("semitransp");
        newCy.elements().removeClass("highlight");
      });
    };

    run();

    tippy("#details-button", {
      content: "click to toggle the detail view on the right",
    });

    tippy("#toggle-last-name", {
      content: "toggle showing the lastname on graph nodes",
    });

    return () => {
      if (cy) {
        cy.destroy();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gedcomPath]);
};
