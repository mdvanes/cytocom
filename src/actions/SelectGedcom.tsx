import { FC, useState } from "react";
import { CUSTOM_GEDCOM } from "../constants";
import { saveState } from "../util/loadSaveState";
import { readFile } from "../util/readFile";

export interface Props {
  gedcomPath: string;
  setGedcomPath: (path: string) => void;
}

export const SelectGedcom: FC<Props> = ({ gedcomPath, setGedcomPath }) => {
  const [showFile, setShowFile] = useState(false);

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    evt
  ) => {
    const fileContent = await readFile(evt);
    saveState({ gedcomContent: fileContent });
    setGedcomPath(CUSTOM_GEDCOM);
  };

  return (
    <div>
      <select
        name="gedcom"
        id="gedcom"
        onChange={(evt) => {
          if (evt.target.value === CUSTOM_GEDCOM) {
            setShowFile(true);
          } else if (evt.target.value) {
            setShowFile(false);
            setGedcomPath(evt.target.value);
          }
        }}
        value={gedcomPath}
        className="primary"
      >
        <option value="/cytocom/7sisters.ged">Seven Sisters</option>
        <option value="https://mon.arbre.app/gedcoms/royal92.ged">
          Windsor
        </option>
        <option value="custom">Custom</option>
      </select>
      {showFile && <input type="file" onChange={handleUpload} />}
    </div>
  );
};
