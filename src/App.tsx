import cytoscape, { LayoutOptions } from "cytoscape";
import dagre from "cytoscape-dagre";
import { FC, ReactElement, useState } from "react";
import "./App.css";
import { dagreLayout } from "./layouts";
// @ts-expect-error
import cola from "cytoscape-cola";
import { useSearchParams } from "react-router-dom";
import "tippy.js/dist/tippy.css";
import { Actions } from "./actions/Actions";
import { useLoadGedcomToGraph } from "./useLoadGedcomToGraph";
import { useRange } from "./useRange";

cytoscape.use(cola);
cytoscape.use(dagre);

const App: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cy, setCy] = useState<cytoscape.Core>();
  const [layout, setLayout] = useState<LayoutOptions>(dagreLayout);
  const { rangeSlider } = useRange(cy);
  const [sources, setSources] = useState<Record<string, string>>();
  const [details, setDetails] = useState<ReactElement>();
  const [showDetails, setShowDetails] = useState(true);
  const gedcomPath =
    searchParams.get("gedcomPath") ??
    "https://mon.arbre.app/gedcoms/royal92.ged";

  useLoadGedcomToGraph({
    cy,
    gedcomPath,
    layout,
    setCy,
    setDetails,
    setSources,
  });

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
