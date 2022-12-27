import { FC } from "react";

export interface Props {
  setGedcomPath: (path: string) => void;
}

export const SelectGedcom: FC<Props> = ({ setGedcomPath }) => {
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
      >
        <option value="https://mon.arbre.app/gedcoms/royal92.ged">
          Royal Family
        </option>
        <option value="/cytocom/7sisters.ged">Seven Sisters</option>
        <option value="/cytocom/example.ged">Example</option>
      </select>
    </div>
  );
};
