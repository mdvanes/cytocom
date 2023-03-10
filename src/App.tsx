import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { FC, ReactElement, useState } from "react";
import "./App.css";
// @ts-expect-error
import cola from "cytoscape-cola";
import { useSearchParams } from "react-router-dom";
import "tippy.js/dist/tippy.css";
import { Actions } from "./actions/Actions";
import { useLoadGedcomToGraph } from "./useLoadGedcomToGraph";
import { useRange } from "./useRange";
import { layoutKeys, LayoutKeys } from "./actions/SelectLayout";
import { MAX_FAMILIES } from "./constants";

cytoscape.use(cola);
cytoscape.use(dagre);

const getLayoutWithFallback = (searchParams: URLSearchParams): LayoutKeys => {
  const x = searchParams.get("layout");
  if (x && x in layoutKeys) {
    return x as LayoutKeys;
  }
  return "dagre";
};

const App: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cy, setCy] = useState<cytoscape.Core>();
  const { rangeSlider, initMinMax } = useRange(cy);
  const [sources, setSources] = useState<Record<string, string>>();
  const [details, setDetails] = useState<ReactElement>();
  const [showDetails, setShowDetails] = useState(true);
  const [nrOfFamilies, setNrOfFamilies] = useState(0);
  const gedcomPath =
    searchParams.get("gedcomPath") ??
    "https://mon.arbre.app/gedcoms/royal92.ged";
  const layout: LayoutKeys = getLayoutWithFallback(searchParams);

  useLoadGedcomToGraph({
    cy,
    gedcomPath,
    initMinMax,
    layout,
    setCy,
    setDetails,
    setSources,
    setNrOfFamilies,
  });

  return (
    <div className={`App ${showDetails ? "show-details" : ""}`}>
      <section>
        <div id="cy"></div>
        <aside>{details}</aside>
      </section>

      {nrOfFamilies > MAX_FAMILIES && (
        <p className="max-families-exceeded">
          ⚠️ WARNING: this GEDCOM contains {nrOfFamilies} families, but only{" "}
          {MAX_FAMILIES} families will be displayed!
        </p>
      )}
      <Actions
        layout={layout}
        setLayout={(newLayout) => {
          setSearchParams((prev) => {
            return {
              ...Object.fromEntries(prev),
              layout: newLayout,
            };
          });
        }}
        gedcomPath={gedcomPath}
        setGedcomPath={(newPath) => {
          setSearchParams((prev) => ({
            ...Object.fromEntries(prev),
            gedcomPath: newPath,
          }));
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
