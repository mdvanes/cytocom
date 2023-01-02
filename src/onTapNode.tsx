import cytoscape, { NodeSingular } from "cytoscape";
import { ReactElement } from "react";
import "tippy.js/dist/tippy.css";
import "./App.css";
import { IndivDetails } from "./graph/IndivDetails";

interface OnTapNodeProps {
  setDetails: (x: ReactElement) => void;
  sources: Record<string, string>;
  images: Record<string, string>;
}

export const onTapNode =
  ({ setDetails, sources, images }: OnTapNodeProps): cytoscape.EventHandler =>
  (evt) => {
    // var popperElement = evt.target.scratch("tippy-popper");
    // evt.target.scratch("tippy").show(popperElement);

    const target: NodeSingular = evt.target;
    const nodeData = target.data();

    setDetails(
      <IndivDetails nodeData={nodeData} sources={sources} images={images} />
    );
    // const tippyInstance = makeTippy(target, "foo");
    // tippyInstance.show();
    // tippyInstance.reference;

    // setNodeTippy(tippyInstance.reference);
    // setTimeout(() => {
    //   tippyA.destroy();
    // }, 1000);
  };

// newCy.on("click", () => {
//   // // const x = (newCy.nodes() as any).popper();
//   console.log("clicked outside", nodeTippy);
//   // // newCy.elements().popper().destroy();
//   // if (nodePopper) {
//   //   nodePopper.destroy();
//   //   setNodePopper(undefined);
//   // }
//   if (nodeTippy) {
//     nodeTippy.destroy();
//     setNodeTippy(undefined);
//   }
// });

// newCy.on("tap", "node", (evt) => {
//   const target: NodeSingular = evt.target;

//   // console.log(ev, n, n.id, n.data);
//   const nodeData = target.data();
//   console.log(`Clicked on node for ${nodeData.name}`, nodeData);

//   // var tippy = makeTippy(n, h('div', {}, $links));
//   // tippy(n.popperRef())
//   //         alert(`${nodeData.names}

//   // ${nodeData.s === "M" ? "Male" : "Female"}
//   // Born: ${nodeData.birthDateString ?? ""}
//   // ${nodeData.deathDateString ? `Death: ${nodeData.deathDateString}` : ""}
//   // Sources: ${nodeData.sources.map((source: string) => {
//   //           return sources ? sources[source] : "";
//   //         })}
//   // Image: ${nodeData.image}
//   // ID: ${nodeData.id}`);

//   // ${JSON.stringify(nodeData, null, 2)}`);

//   const newNodePopper = target.popper({
//     content: () => {
//       const div = document.createElement("div");
//       div.className = "node-popup";
//       div.innerHTML = `<h2>${nodeData.names}</h2>
//       Image: <img src="${images && images[nodeData.image]}" />
//       ID: ${nodeData.id}`;
//       document.body.appendChild(div);
//       return div;
//     },
//     // popper: {}, // my popper options here
//   });
//   // console.log(newNodePopper);
//   setNodePopper(newNodePopper);
// });
