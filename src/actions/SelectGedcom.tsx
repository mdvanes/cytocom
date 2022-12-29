import { FC } from "react";
import { loadState } from "../util/loadSaveState";

export interface Props {
  setGedcomPath: (path: string) => void;
}

export const SelectGedcom: FC<Props> = ({ setGedcomPath }) => {
  const loadedState = loadState();
  return (
    <div>
      <select
        name="gedcom"
        id="gedcom"
        onChange={(evt) => {
          if (evt.target.value) {
            setGedcomPath(evt.target.value);
          }
        }}
        value={loadedState.gedcomPath}
        className="primary"
      >
        <option value="/cytocom/7sisters.ged">Seven Sisters</option>
        <option value="https://mon.arbre.app/gedcoms/royal92.ged">
          Windsor
        </option>
        <option value="/cytocom/example.ged">Example</option>
      </select>
    </div>
  );
};
