import "./App.css";
import cytoscape from "cytoscape";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // const cy =
    cytoscape({
      container: document.getElementById("cy"), // container to render in
      elements: [
        // list of graph elements to start with
        {
          // node a
          data: { id: "a" },
        },
        {
          // node b
          data: { id: "b" },
        },
        {
          // edge ab
          data: { id: "ab", source: "a", target: "b" },
        },
      ],

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

      layout: {
        name: "grid",
        rows: 1,
      },
    });
  }, []);

  return (
    <div className="App">
      <div id="cy"></div>
    </div>
  );
}

export default App;
