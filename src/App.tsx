import "./App.css";
import cytoscape, { LayoutOptions } from "cytoscape";
import { FC, useEffect, useState } from "react";
import dagre from "cytoscape-dagre";
import { generateHierachicalEdges, generateNodes } from "./dataGenerators";
import {
  dagreLayout,
  concentricLayout,
  gridLayout,
  colaLayout,
} from "./layouts";
import { readGedcom, SelectionIndividualRecord } from "read-gedcom";
// @ts-expect-error
import cola from "cytoscape-cola";

cytoscape.use(cola);
cytoscape.use(dagre);

const getRenderedName = (rec: SelectionIndividualRecord): string => {
  console.log(
    rec,
    "| birth",
    // @ts-expect-error
    rec.getEventBirth().getDate().valueAsDate()[0].date.year.value,
    rec.getEventBirth().getDate().value()[0],
    "| death",
    rec.getEventDeath().getDate().value()[0],
    "| s",
    rec.getSex().value()[0]
  );
  const names =
    rec.getName().getNickname().value()[0] ??
    rec.getName().getGivenName().value()[0] ??
    rec.getName().value()[0] ??
    "";
  // TODO this is making the invalid assumption that a single name can't contain a space, e.g. Mette Marit is a counter example.
  if (names.indexOf(" ") > -1) {
    return names.split(" ")[0];
  }
  return names;
};

// https://docs.arbre.app/read-gedcom/pages/basic-examples.html
const foo = async () => {
  const gedcom = await fetch("https://mon.arbre.app/gedcoms/royal92.ged")
    // const gedcom = await fetch("/example.ged")
    .then((r) => r.arrayBuffer())
    .then(readGedcom);

  // console.log(gedcom.getHeader().toString());
  // console.log(gedcom.toString());
  // console.log(gedcom.getIndividualRecord().getName());
  // console.log(gedcom.getIndividualRecord().getName().value());
  const victoria = gedcom.getIndividualRecord().arraySelect()[0];
  const fam = victoria.getFamilyAsSpouse();
  // console.log(victoria.getName().getNickname().value());
  // console.log(fam.getHusband().getIndividualRecord().getName().value());
  // console.log(fam.getChild().getIndividualRecord().getName().value());
  const result = {
    parents: [
      {
        // name: victoria.getName().value(),
        name: getRenderedName(victoria),
        // id: victoria.getRecordIdentificationNumber().value(),
        pointer: victoria.arraySelect()[0].pointer(),
      },
      {
        // name: victoria.getName().value(),
        name: getRenderedName(fam.getHusband().getIndividualRecord()),
        // id: victoria.getRecordIdentificationNumber().value(),
        pointer: fam
          .getHusband()
          .getIndividualRecord()
          .arraySelect()[0]
          .pointer(),
      },
    ],
    children: fam
      .getChild()
      .getIndividualRecord()
      .arraySelect()
      .map((child) => ({
        // id: child.arraySelect()[0].getReferenceNumber().value(),
        // name: child.getName().value(),
        name: getRenderedName(child),
        pointer: child.arraySelect()[0].pointer(),
        s: child.getSex().value()[0],
      })),
  };
  // console.log(JSON.stringify(result, null, 2));
  return result;
};

const famToNodes = (fam: any) => {
  // console.log(fam);
  return [
    ...fam.parents.map((x: any) => {
      return {
        data: {
          id: `${x.pointer[0]}`,
          name: x.name,
          color: x.s === "F" ? "#ff6d91" : "#8cb4ff",
        },
      };
    }),
    ...fam.children.map((x: any) => {
      return {
        data: {
          id: `${x.pointer[0]}`,
          name: x.name,
          color: x.s === "F" ? "#ff6d91" : "#8cb4ff",
        },
      };
    }),
  ];
};

const famToEdges = (fam: any) => {
  // console.log(fam);
  const m = fam.parents[0];
  const p = fam.parents[1];
  return fam.children.flatMap((x: any) => {
    return [
      {
        data: {
          id: `${m.pointer[0]}-${x.pointer[0]}`,
          source: `${m.pointer[0]}`,
          target: `${x.pointer[0]}`,
        },
      },
      {
        data: {
          id: `${p.pointer[0]}-${x.pointer[0]}`,
          source: `${p.pointer[0]}`,
          target: `${x.pointer[0]}`,
        },
      },
    ];
  });
};

const App: FC = () => {
  const [cy, setCy] = useState<cytoscape.Core>();
  const [layout, setLayout] = useState<LayoutOptions>(dagreLayout);

  // const elements = [
  //   ...generateNodes(),
  //   // ...generateLineairEdges(),
  //   ...generateHierachicalEdges(),
  // ];

  useEffect(() => {
    const run = async () => {
      const fam = await foo();
      const elements = [...famToNodes(fam), ...famToEdges(fam)];

      const newCy = cytoscape({
        container: document.getElementById("cy"), // container to render in
        elements,
        style: [
          // the stylesheet for the graph
          {
            selector: "node",
            style: {
              color: "white",
              "background-color": "data(color)",
              // "background-color": "#4e4e4e",
              label: "data(name)",
            },
          },

          {
            selector: "edge",
            style: {
              width: 3,
              "line-color": "#afa100",
              "target-arrow-color": "#afa100",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
            },
          },
        ],

        layout,
      });
      setCy(newCy);
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rotateLayout = (fromLayout: LayoutOptions): LayoutOptions => {
    if (fromLayout.name === "dagre") {
      return concentricLayout;
    }
    if (fromLayout.name === "concentric") {
      return gridLayout;
    }
    if (fromLayout.name === "grid") {
      return colaLayout;
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
          change layout [{layout.name}]
        </button>
      </div>
    </div>
  );
};

export default App;
