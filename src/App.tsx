import "./App.css";
import cytoscape, { LayoutOptions } from "cytoscape";
import { FC, useEffect, useState } from "react";
import dagre from "cytoscape-dagre";
import { generateHierachicalEdges, generateNodes } from "./dataGenerators";
import { dagreLayout, concentricLayout, gridLayout } from "./layouts";

cytoscape.use(dagre);

const App: FC = () => {
  const [cy, setCy] = useState<cytoscape.Core>();
  const [layout, setLayout] = useState<LayoutOptions>(dagreLayout);

  const elements = [
    ...generateNodes(),
    // ...generateLineairEdges(),
    ...generateHierachicalEdges(),
  ];

  useEffect(() => {
    const newCy = cytoscape({
      container: document.getElementById("cy"), // container to render in
      elements,
      style: [
        // the stylesheet for the graph
        {
          selector: "node",
          style: {
            color: "white",
            "background-color": "#4e4e4e",
            label: "data(id)",
          },
        },

        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
      ],

      layout,
    });
    setCy(newCy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rotateLayout = (fromLayout: LayoutOptions): LayoutOptions => {
    if (fromLayout.name === "dagre") {
      return concentricLayout;
    }
    if (fromLayout.name === "concentric") {
      return gridLayout;
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
          change layout
        </button>
      </div>
    </div>
  );
};

export default App;
