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
