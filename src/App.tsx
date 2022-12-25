import cytoscape, {
  CollectionReturnValue,
  EdgeDefinition,
  LayoutOptions,
  NodeSingular,
} from "cytoscape";
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
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { getMinMaxDate } from "./getMinMaxDate";
import { useRange } from "./useRange";

cytoscape.use(cola);
cytoscape.use(dagre);

const famToNodes = (fam: Family) => {
  // console.log(fam);
  return [...fam.parents, ...fam.children];
};

const famToEdges = (fam: Family): EdgeDefinition[] => {
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
  // const minDate = 1800;
  // const maxDate = 2022;
  // const [from, setFrom] = useState(minDate);
  // const [to, setTo] = useState(maxDate);
  const [minMaxDate, setMinMaxDate] = useState<[number, number]>([
    -Infinity,
    Infinity,
  ]);
  const { handleRangeChange, range, setRange } = useRange(cy);
  // const [range, setRange] = useState<number | number[]>([-Infinity, Infinity]);
  // const [removed, setRemoved] = useState<CollectionReturnValue>();

  // const elements = [
  //   ...generateNodes(),
  //   // ...generateLineairEdges(),
  //   ...generateHierachicalEdges(),
  // ];

  useEffect(() => {
    const run = async () => {
      const fam = await loadGedcom();
      const elements = [...famToNodes(fam), ...famToEdges(fam)];

      const minMaxDate = getMinMaxDate(elements);
      setMinMaxDate(minMaxDate);
      setRange(minMaxDate);

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
              // NOTE: This works, but does not hide the edges. Also, how to call this after the graph is rendered?
              // visibility: (n: any) =>
              //   n.data("birthYear") < 1821 ? "hidden" : "visible",
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

  // const handleRangeChange = (val: number | number[]) => {
  //   setRange(val);
  //   if (removed) {
  //     removed.restore();
  //   }
  //   if (typeof val === "object" && val[0] && cy) {
  //     const result = cy.$(`[birthYear < ${val[0]}]`).remove();
  //     setRemoved(result);
  //   }
  // };

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

        <div style={{ width: 300 }}>
          <Slider
            range
            allowCross={false}
            min={minMaxDate[0]}
            max={minMaxDate[1]}
            defaultValue={range}
            value={range}
            onChange={handleRangeChange}
          />
          {typeof range === "object" ? `from ${range[0]} to ${range[1]}` : ""}
        </div>
      </div>
    </div>
  );
};

export default App;
