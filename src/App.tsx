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
import { IndivDetails } from "./graph/IndivDetails";
import { getStyle } from "./graph/style";
import { loadGedcom } from "./loadGedcom";
import { useRange } from "./useRange";
import { logLoaded } from "./util/readFile";
import { useSearchParams } from "react-router-dom";

cytoscape.use(cola);
cytoscape.use(dagre);

const App: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cy, setCy] = useState<cytoscape.Core>();
  const [layout, setLayout] = useState<LayoutOptions>(dagreLayout);
  const { initMinMax, rangeSlider } = useRange(cy);
  const [sources, setSources] = useState<Record<string, string>>();
  // const [images, setImages] = useState<Record<string, string>>();
  const [details, setDetails] = useState<any>();
  const [showDetails, setShowDetails] = useState(true);
  const gedcomPath =
    searchParams.get("gedcomPath") ??
    "https://mon.arbre.app/gedcoms/royal92.ged";

  useEffect(() => {
    const run = async () => {
      const { elements, ...gedcom } = await loadGedcom(gedcomPath);

      logLoaded(gedcomPath, elements);

      setSources(gedcom.sources);
      // setImages(gedcom.images);
      initMinMax(elements);

      const newCy = cytoscape({
        container: document.getElementById("cy"), // container to render in
        elements,
        style: getStyle({ images: gedcom.images }),
        layout,
      });

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
        const target: NodeSingular = evt.target;
        // const node = target[0]._private.data;
        // console.log("tapped ", node.name);

        // newCy
        //   .elements()
        //   .difference(target.outgoers())
        //   .not(target)
        //   .addClass("semitransp");
        // target.addClass("highlight").outgoers().addClass("highlight");
        target.addClass("highlight").neighborhood().addClass("highlight");
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
        gedcomPath={gedcomPath}
        setGedcomPath={(newPath) => {
          setSearchParams({
            gedcomPath: newPath,
          });
        }}
        rangeSlider={rangeSlider}
        setShowDetails={setShowDetails}
        cy={cy}
        sources={sources}
      />
    </div>
  );
};

export default App;
