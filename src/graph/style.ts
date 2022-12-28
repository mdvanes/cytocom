import { CytoscapeOptions, NodeSingular } from "cytoscape";

interface Args {
  images: Record<string, string>;
}

export const getStyle = ({ images }: Args): CytoscapeOptions["style"] => [
  // the stylesheet for the graph
  {
    selector: "node",
    style: {
      color: "white",
      "border-color": (n: NodeSingular) => {
        // return n.data("deathYear") ? "#757575" : "transparent";
        return n.data("deathYear") ? "#fff" : "transparent";
      },
      "border-width": (n: NodeSingular) => {
        return n.data("deathYear") ? "2" : "0";
      },
      // border: "1px solid red",
      "background-color": "data(color)",
      // "background-color": "#4e4e4e",
      label: "data(name)",
      "background-fit": "cover",
      // NOTE: This works, but does not hide the edges. Also, how to call this after the graph is rendered?
      // visibility: (n: any) =>
      //   n.data("birthYear") < 1821 ? "hidden" : "visible",
    },
  },
  {
    selector: "node[image]",
    style: {
      "background-image": (n) => {
        // NOTE "images" sometimes becomes the empty object when loading new gedcom in which case cytoscape logs an error, so prevent returning undefined by returning an image that does not exist
        const src = images && images[n.data("image")];
        return src || "example.png";
      },
    },
  },

  {
    selector: "edge",
    style: {
      width: 0.5,
      "line-style": (n) => {
        return n.data("style") || "solid";
      },
      "line-color": "#afa100",
      "target-arrow-color": "#afa100",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },

  {
    selector: "node.highlight",
    style: {
      "border-color": "green",
      "border-width": "2px",
    },
  },

  {
    selector: "node.semitransp",
    style: { opacity: 0.5 },
  },

  {
    selector: "edge.highlight",
    style: {
      "line-color": "green",
      "target-arrow-color": "green",
      width: 1.5,
    },
  },
  {
    selector: "edge.semitransp",
    style: { opacity: 0.2 },
  },
];
