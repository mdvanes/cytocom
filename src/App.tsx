import cytoscape, { LayoutOptions } from "cytoscape";
import dagre from "cytoscape-dagre";
import { FC, useEffect, useState } from "react";
import "./App.css";
import { dagreLayout, rotateLayout } from "./layouts";
// @ts-expect-error
import cola from "cytoscape-cola";
import { loadGedcom } from "./loadGedcom";
import { Family } from "./types";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

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
      // console.log(elements);

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
              width: 0.5,
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

      newCy.nodes().forEach((n) => {
        n.on("click", (ev) => {
          // console.log(ev, n, n.id, n.data);
          const nodeData = n.data();
          console.log(`Clicked on node for ${nodeData.name}`, nodeData);

          // var tippy = makeTippy(n, h('div', {}, $links));
          // tippy(n.popperRef())
          alert(`${nodeData.name}

${nodeData.s === "M" ? "Male" : "Female"}          
Born: ${nodeData.birthDateString}
Death: ${nodeData.deathDateString}
ID: ${nodeData.id}`);
          // ${JSON.stringify(nodeData, null, 2)}`);
        });
      });
    };

    run();

    tippy("#mybutton", {
      content: "some tippy content",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        <button
          id="mybutton"
          className="secondary"
          onClick={(evt) => {
            console.log("click");
          }}
        >
          test tippy
        </button>
      </div>
    </div>
  );
};

export default App;
