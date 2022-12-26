import { Family } from "./types";
import { readGedcom, SelectionFamilyRecord } from "read-gedcom";
import { mapRecordToNode } from "./mapRecordToNode";
import { NodeDefinition, EdgeDefinition } from "cytoscape";

// const isDefined = <T>(x: T | undefined | null): x is T => {
//   return Boolean(x);
// };

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
}> => {
  // const gedcom = await fetch("https://mon.arbre.app/gedcoms/royal92.ged")
  // const gedcom = await fetch("/cytocom/example.ged")
  const gedcom = await fetch(path)
    .then((r) => r.arrayBuffer())
    .then(readGedcom);

  const families = gedcom.getFamilyRecord();

  console.log("note", gedcom.getNoteRecord().arraySelect());
  console.log(
    "source",
    gedcom
      .getSourceRecord()
      .arraySelect()
      .map((m) => ({
        // f: m.getFileReference().value(),
        n: m.getDescriptiveTitle().value(),
      }))
  );
  console.log(
    "media",
    gedcom
      .getMultimediaRecord()
      .arraySelect()
      .map((m) => ({
        f: m.getFileReference().value(),
        n: m.getNote().value(),
      }))
  );

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

  return {
    elements: result,
    sources,
  };
};
