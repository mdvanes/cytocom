import cytoscape, { LayoutOptions, NodeSingular } from "cytoscape";
import dagre from "cytoscape-dagre";
import { FC, useEffect, useState } from "react";
import "./App.css";
import { dagreLayout } from "./layouts";
// @ts-expect-error
import cola from "cytoscape-cola";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { Actions } from "./actions/Actions";
import { loadGedcom } from "./loadGedcom";
import { useRange } from "./useRange";
import { loadState, saveState } from "./util/loadSaveState";
import { MappedNames } from "./gedcom/mapNames";
import { NamesList } from "./graph/NamesList";
import { IndivDetails } from "./graph/IndivDetails";
// import popper, { getPopperInstance } from "cytoscape-popper";
// import tippyC from "cytoscape.js-tippy";

cytoscape.use(cola);
cytoscape.use(dagre);
// cytoscape.use(popper);
// cytoscape.use(tippy);

// var makeTippy = function (ele: any, text: string) {
//   var ref = ele.popperRef();

//   // Since tippy constructor requires DOM element/elements, create a placeholder
//   var dummyDomEle = document.createElement("div");

//   var tip = tippy(dummyDomEle, {
//     getReferenceClientRect: ref.getBoundingClientRect,
//     trigger: "manual", // mandatory
//     // dom element inside the tippy:
//     content: function () {
//       // function can be better for performance
//       var div = document.createElement("div");

//       div.innerHTML = text;

//       return div;
//     },
//     // your own preferences:
//     arrow: true,
//     placement: "bottom",
//     hideOnClick: false,
//     sticky: "reference",

//     // if interactive:
//     interactive: true,
//     appendTo: document.body, // or append dummyDomEle to document.body
//   });

//   return tip;
// };

// type PopperInstance = ReturnType<getPopperInstance<unknown>>;

const App: FC = () => {
  const loadedState = loadState();
  const [cy, setCy] = useState<cytoscape.Core>();
  const [layout, setLayout] = useState<LayoutOptions>(dagreLayout);
  const { initMinMax, rangeSlider } = useRange(cy);
  const [gedcomPath, setGedcomPath] = useState(loadedState.gedcomPath);
  const [sources, setSources] = useState<Record<string, string>>();
  const [images, setImages] = useState<Record<string, string>>();
  const [details, setDetails] = useState<any>();
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    saveState({ gedcomPath });
  }, [gedcomPath]);

  useEffect(() => {
    const run = async () => {
      const { elements, ...gedcom } = await loadGedcom(gedcomPath);

      setSources(gedcom.sources);
      setImages(gedcom.images);
      initMinMax(elements);

      const newCy = cytoscape({
        container: document.getElementById("cy"), // container to render in
        elements,
        style: [
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
                const src = gedcom.images && gedcom.images[n.data("image")];
                return src || "example.png";
              },
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
        ],

        layout,
      });

      // Testing a filter
      // const x = newCy.nodes().filter((n) => n.data("birthYear") < 1821);
      // console.log(newCy.nodes(), x);
      // const x= newCy.$("[birthYear > 1820]");
      // newCy.nodes().not(x).remove();
      // Note: does not work: newCy.nodes().restore();
      // Note: This works with restore, but does not restore edges
      // x.remove();
      // x.restore();

      setCy(newCy);

      newCy.on("tap", "node", function (evt) {
        // var popperElement = evt.target.scratch("tippy-popper");
        // evt.target.scratch("tippy").show(popperElement);

        const target: NodeSingular = evt.target;
        const nodeData = target.data();

        setDetails(
          <IndivDetails
            nodeData={nodeData}
            sources={gedcom.sources}
            images={gedcom.images}
          />
        );
        // const tippyInstance = makeTippy(target, "foo");
        // tippyInstance.show();
        // tippyInstance.reference;

        // setNodeTippy(tippyInstance.reference);
        // setTimeout(() => {
        //   tippyA.destroy();
        // }, 1000);
      });

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

      newCy.on("mouseover", "node", (evt) => {
        const target: any = evt.target;
        // const node = target[0]._private.data;
        // console.log("tapped ", node.name);

        newCy
          .elements()
          .difference(target.outgoers())
          .not(target)
          .addClass("semitransp");
        target.addClass("highlight").outgoers().addClass("highlight");
      });

      newCy.on("mouseout", "node", (evt) => {
        //select either edges or nodes to remove the styles
        //var edges = cy.edges();
        //var nodes = cy.nodes()
        // edges.removeClass('semitransp');
        // nodes.removeClass('semitransp');
        //you can select all elements and remove the styles
        newCy.elements().removeClass("semitransp");
        newCy.elements().removeClass("highlight");
      });

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
    };

    run();

    tippy("#mybutton", {
      content: "click to toggle the detail view on the right",
    });

    return () => {
      if (cy) {
        cy.destroy();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gedcomPath]);

  return (
    <div className={`App ${showDetails ? "show-details" : ""}`}>
      <section>
        <div id="cy"></div>
        <aside>{details}</aside>
      </section>

      <Actions
        setLayout={setLayout}
        setGedcomPath={setGedcomPath}
        rangeSlider={rangeSlider}
        setShowDetails={setShowDetails}
        cy={cy}
        sources={sources}
      />
    </div>
  );
};

export default App;
