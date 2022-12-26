import { Family } from "./types";
import { readGedcom, SelectionFamilyRecord } from "read-gedcom";
import { mapRecordToNode } from "./mapRecordToNode";
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
export const loadGedcom = async (): Promise<
  (NodeDefinition | EdgeDefinition)[]
> => {
  const gedcom = await fetch("https://mon.arbre.app/gedcoms/royal92.ged")
    // const gedcom = await fetch("/cytocom/example.ged")
    .then((r) => r.arrayBuffer())
    .then(readGedcom);

  const families = gedcom.getFamilyRecord();

  const mappedFamilies = families.arraySelect().slice(0, 30).map(mapFamily);
  const result = mappedFamilies.reduce<(NodeDefinition | EdgeDefinition)[]>(
    (acc, next) => {
      return [...acc, ...next.parents, ...next.children];
    },
    []
  );

  return result;
};
