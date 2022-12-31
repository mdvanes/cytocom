import { FC, useState } from "react";
import { loadState } from "../util/loadSaveState";
import { isFileContent, readFile } from "../util/readFile";

export interface Props {
  setGedcomPath: (path: string) => void;
}

export const SelectGedcom: FC<Props> = ({ setGedcomPath }) => {
  const loadedState = loadState();
  const [showFile, setShowFile] = useState(false);

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    evt
  ) => {
    const fileContent = await readFile(evt);
    setGedcomPath(fileContent);
  };

  return (
    <div>
      <select
        name="gedcom"
        id="gedcom"
        onChange={(evt) => {
          if (evt.target.value === "custom") {
            setShowFile(true);
          } else if (evt.target.value) {
            setShowFile(false);
            setGedcomPath(evt.target.value);
          }
        }}
        value={
          isFileContent(loadedState.gedcomPath)
            ? "custom"
            : loadedState.gedcomPath
        }
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
