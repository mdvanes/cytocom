import "./App.css";
import cytoscape, { CytoscapeOptions, LayoutOptions } from "cytoscape";
import { useEffect, useState } from "react";
import dagre from "cytoscape-dagre";

cytoscape.use(dagre);

const nrOfNodes = 10;

const generateNodes = () => {
  return new Array(nrOfNodes).fill(0).map((v, i) => ({
    data: { id: `a${i}` },
  }));
};

// a -> b -> c
const generateLineairEdges = (): any => {
  const f = new Array(nrOfNodes - 1).fill(0).map((v, i) => ({
    data: { id: `ab${i}`, source: `a${i}`, target: `a${i + 1}` },
  }));
  return f;
};

// c <- a -> b
const generateHierachicalEdges = (): any => {
  const firstHalf = nrOfNodes / 2;

  const f = new Array(firstHalf - 1).fill(0).map((v, i) => ({
    data: { id: `ab${i}`, source: `a${i}`, target: `a${i + 1}` },
  }));

  const f2 = new Array(firstHalf).fill(0).map((v, i) => ({
    data: { id: `ba${i}`, source: `a0`, target: `a${i + firstHalf}` },
  }));

  const f3 = f.concat(f2);
  // console.log(f3);
  return f3;
};

const gridLayout: LayoutOptions = {
  name: "grid",
  rows: 2,
};

const randomLayout: LayoutOptions = {
  name: "random",
  fit: true, // whether to fit to viewport
  padding: 30, // fit padding
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  animateFilter: function (node, i) {
    return true;
  }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position) {
    return position;
  }, // transform a given node position. Useful for changing flow direction in discrete layouts
};

const nullLayout: LayoutOptions = {
  name: "null",
  ready: function () {}, // on layoutready
  stop: function () {}, // on layoutstop
};

// https://github.com/cytoscape/cytoscape.js-dagre
const dagreLayout: LayoutOptions = {
  name: "dagre",
};

// https://js.cytoscape.org/#layouts/concentric
const concentricLayout: LayoutOptions = {
  name: "concentric",
};

function App() {
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
}

export default App;
