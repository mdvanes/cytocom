import { Family } from "./types";
import { readGedcom, SelectionFamilyRecord } from "read-gedcom";
import { mapRecordToNode } from "./gedcom/mapRecordToNode";
import { NodeDefinition, EdgeDefinition } from "cytoscape";

const mapFamily = (fam: SelectionFamilyRecord): Family => {
  const parent1 = fam.getWife().getIndividualRecord();
  const parent2 = fam.getHusband().getIndividualRecord();

  const result = {
    parents: [...mapRecordToNode([])(parent1), ...mapRecordToNode([])(parent2)],
    children: fam
      .getChild()
      .getIndividualRecord()
      .arraySelect()
      .flatMap(mapRecordToNode([parent1, parent2])),
  };

  return result;
};

// https://docs.arbre.app/read-gedcom/pages/basic-examples.html
export const loadGedcom = async (
  path: string
): Promise<{
  elements: (NodeDefinition | EdgeDefinition)[];
  sources: Record<string, string>;
  images: Record<string, string>;
}> => {
  const gedcom = await fetch(path)
    .then((r) => r.arrayBuffer())
    .then(readGedcom);

  const families = gedcom.getFamilyRecord();

  // console.log("note", gedcom.getNoteRecord().arraySelect());

  const mappedFamilies = families.arraySelect().slice(0, 30).map(mapFamily);
  const result = mappedFamilies.reduce<(NodeDefinition | EdgeDefinition)[]>(
    (acc, next) => {
      return [...acc, ...next.parents, ...next.children];
    },
    []
  );

  const sources = Object.fromEntries(
    gedcom
      .getSourceRecord()
      .arraySelect()
      // .map((source) => ({
      //   id: source.pointer()[0] ?? "",
      //   name: source.getDescriptiveTitle().value()[0] ?? "",
      // }));
      .map((source) => [
        source.pointer()[0] ?? "",
        source.getDescriptiveTitle().value()[0] ?? "",
      ])
  );

  // TODO this currently only works if the value is a publically accessible URI
  const images = Object.fromEntries(
    gedcom
      .getMultimediaRecord()
      .arraySelect()
      .map((source) => [
        source.pointer()[0] ?? "",
        source.getFileReference().value()[0] ?? "",
      ])
  );

  return {
    elements: result,
    sources,
    images,
  };
};
