import { CytoscapeOptions, EdgeSingular, NodeSingular } from "cytoscape";

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
      // "background-color": "#4e4e4e",
      "background-fit": "cover",
      // NOTE: This works, but does not hide the edges. Also, how to call this after the graph is rendered?
      // visibility: (n: any) =>
      //   n.data("birthYear") < 1821 ? "hidden" : "visible",
      // "background-color": "data(color)",
      // label: "data(name)",
      label: (n: NodeSingular) => {
        const name = n.data("name") || "";
        const deathYear = n.data("deathYear") ? " †" : "";
        const url = n.data("url") ? " 🔗" : "";
        return `${name}${deathYear}${url}`;
      },
      // "text-wrap": "wrap",
    },
  },
  // {
  //   selector: "node[name]",
  //   style: {
  //     label: "data(name)",
  //   },
  // },
  {
    selector: "node[color]",
    style: {
      "background-color": "data(color)",
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
      // "curve-style": "taxi",
      "curve-style": "bezier",
      width: 0.5,
      "line-style": (n) => {
        return n.data("style") || "solid";
      },
      "line-color": (n) => {
        const type = n.data("type");
        if (type && type === "parents") {
          return "#bea5ff";
        }
        if (type && type === "association") {
          return "white";
        }
        return "#afa100";
      },
      "target-arrow-color": "#afa100",
      "target-arrow-shape": (n) => {
        const type = n.data("type");
        if (type && (type === "parents" || type === "association")) {
          return "none";
        }
        return "triangle";
      },
    },
  },

  {
    selector: "edge[label]",
    style: {
      color: (n: EdgeSingular) => {
        const type = n.data("type");
        if (type && type === "parents") {
          return "#705e9d";
        }
        if (type && type === "association") {
          return "#bababa";
        }
        return "#827914";
      },
      label: "data(label)",
      // @ts-expect-error
      "edge-text-rotation": "autorotate",
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
