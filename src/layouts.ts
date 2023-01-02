import { LayoutOptions } from "cytoscape";

export const gridLayout: LayoutOptions = {
  name: "grid",
  rows: 2,
  animate: true,
};

// const randomLayout: LayoutOptions = {
//   name: "random",
//   fit: true, // whether to fit to viewport
//   padding: 30, // fit padding
//   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//   animate: false, // whether to transition the node positions
//   animationDuration: 500, // duration of animation in ms if enabled
//   animationEasing: undefined, // easing of animation if enabled
//   animateFilter: function (node, i) {
//     return true;
//   }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
//   ready: undefined, // callback on layoutready
//   stop: undefined, // callback on layoutstop
//   transform: function (node, position) {
//     return position;
//   }, // transform a given node position. Useful for changing flow direction in discrete layouts
// };

// const nullLayout: LayoutOptions = {
//   name: "null",
//   ready: function () {}, // on layoutready
//   stop: function () {}, // on layoutstop
// };

// https://github.com/cytoscape/cytoscape.js-dagre
export const dagreLayout: LayoutOptions = {
  name: "dagre",
  // @ts-expect-error
  animate: true,
};

export const breadthfirstLayout: LayoutOptions = {
  name: "breadthfirst",
  fit: true, // whether to fit the viewport to the graph
  directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
  padding: 30, // padding on fit
  circle: false, // put depths in concentric circles if true, put depths top down if false
  grid: true, // whether to create an even grid into which the DAG is placed (circle:false only)
  spacingFactor: 2.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  // roots: ["@I0123@", "@I0020@", "@I0044@"], // the roots of the trees
  // roots: ["@I0004@"],
  maximal: false, // whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)
  depthSort: (a, b) => {
    // console.log(a.data('birthYear'), b.data('birthYear'), a.data());
    return a.data("birthYear") - b.data("birthYear");
  }, // a sorting function to order nodes at equal depth. e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  animate: true, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  // animationEasing: undefined, // easing of animation if enabled,
  // animateFilter: function (node, i) {
  //   return true;
  // }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  // ready: undefined, // callback on layoutready
  // stop: undefined, // callback on layoutstop
};

// https://js.cytoscape.org/#layouts/concentric
export const concentricLayout: LayoutOptions = {
  name: "concentric",
  //   padding: 50,
  animate: true,
  spacingFactor: 2,
};

export const colaLayout: LayoutOptions = {
  name: "cola",
  //   animate: true,
};

// export const elkLayout: LayoutOptions = {
//   name: "elk",
//   // @ts-expect-error
//   elk: {
//     algorithm: "mrtree",
//   },
//   //   animate: true,
// };

// export const rotateLayout = (fromLayout: LayoutOptions): LayoutOptions => {
//   if (fromLayout.name === "dagre") {
//     return concentricLayout;
//   }
//   if (fromLayout.name === "concentric") {
//     return gridLayout;
//   }
//   if (fromLayout.name === "grid") {
//     return colaLayout;
//   }
//   return dagreLayout;
// };
