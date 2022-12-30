import { EdgeDefinition, NodeDefinition } from "cytoscape";
import { MAX_FAMILIES } from "../constants";

export const readFile = (
  evt: React.ChangeEvent<HTMLInputElement>
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { files } = evt.target;
    console.log(files);

    if (!files) {
      reject("");
      return;
    }

    const file = files[0];

    const reader = new FileReader();
    reader.onload = (loadedFile) => {
      if (!loadedFile.target) {
        reject("");
        return;
      }
      const { result } = loadedFile.target;
      if (typeof result !== "string") {
        reject("");
        return;
      }
      resolve(result);
    };
    // TODO would be better to return arraybuffer directly, but it would be more work to check the type of gedcomPath in loadGedcom
    // reader.readAsArrayBuffer(file);
    reader.readAsText(file);
  });
};

export const isFileContent = (path: string) => path.slice(0, 6) === "0 HEAD";

export const logLoaded = (
  path: string,
  elements: (NodeDefinition | EdgeDefinition)[]
): void => {
  const nrOfEdges = elements.filter((elem) => "source" in elem.data).length;
  const nrOfNodes = elements.length - nrOfEdges;
  const from = isFileContent(path) ? "a custom file" : path;
  console.log(
    `Loaded ${elements.length} elements (${nrOfNodes} nodes and ${nrOfEdges} edges) from ${from} | Capped at ${MAX_FAMILIES} families`
  );
};

export const stringToArrayBuffer = (str: string) => {
  const encoder = new TextEncoder();
  const view = encoder.encode(str);
  return view;
};
