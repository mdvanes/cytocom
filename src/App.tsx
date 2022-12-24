import cytoscape, { LayoutOptions } from "cytoscape";
import dagre from "cytoscape-dagre";
import { FC, useEffect, useState } from "react";
import "./App.css";
import {
  colaLayout,
  concentricLayout,
  dagreLayout,
  gridLayout,
} from "./layouts";
// @ts-expect-error
import cola from "cytoscape-cola";
import { loadGedcom } from "./loadGedcom";
import { Family } from "./types";

cytoscape.use(cola);
cytoscape.use(dagre);

const famToNodes = (fam: Family) => {
  // console.log(fam);
  return [...fam.parents, ...fam.children];
};

const famToEdges = (fam: Family) => {
  // console.log(fam);
  const m = fam.parents[0];
  const p = fam.parents[1];
  return fam.children.flatMap((x) => {
    return [
      {
        data: {
          id: `${m.data.id}-${x.data.id}`,
          source: `${m.data.id}`,
          target: `${x.data.id}`,
        },
      },
      {
        data: {
          id: `${p.data.id}-${x.data.id}`,
          source: `${p.data.id}`,
          target: `${x.data.id}`,
        },
      },
    ];
  });
};

const App: FC = () => {
  const [cy, setCy] = useState<cytoscape.Core>();
  const [layout, setLayout] = useState<LayoutOptions>(dagreLayout);

  // const elements = [
  //   ...generateNodes(),
  //   // ...generateLineairEdges(),
  //   ...generateHierachicalEdges(),
  // ];

  useEffect(() => {
    const run = async () => {
      const fam = await loadGedcom();
      const elements = [...famToNodes(fam), ...famToEdges(fam)];
      console.log(elements);

      const newCy = cytoscape({
        container: document.getElementById("cy"), // container to render in
        elements,
        style: [
          // the stylesheet for the graph
          {
            selector: "node",
            style: {
              color: "white",
              "background-color": "data(color)",
              // "background-color": "#4e4e4e",
              label: "data(name)",
            },
          },

          {
            selector: "edge",
            style: {
              width: 3,
              "line-color": "#afa100",
              "target-arrow-color": "#afa100",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
            },
          },
        ],

        layout,
      });
      setCy(newCy);
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rotateLayout = (fromLayout: LayoutOptions): LayoutOptions => {
    if (fromLayout.name === "dagre") {
      return concentricLayout;
    }
    if (fromLayout.name === "concentric") {
      return gridLayout;
    }
    if (fromLayout.name === "grid") {
      return colaLayout;
    }
    return dagreLayout;
  };

  return (
    <div className="App">
      <div id="cy"></div>
      <div className="actions">
        <button
          className="primary"
          onClick={() => {
            if (cy) {
              const newLayout = rotateLayout(layout);
              const cWithLayout = cy.layout(newLayout);
              cWithLayout.run();
              setLayout(newLayout);
            }
          }}
        >
          change layout [{layout.name}]
        </button>
      </div>
    </div>
  );
};

export default App;
