import { Family } from "./types";
import { readGedcom, SelectionFamilyRecord } from "read-gedcom";
import { mapRecordToNode } from "./mapRecordToNode";
import { NodeDefinition, EdgeDefinition } from "cytoscape";

// const mapFamilyAsSpouse = (record: SelectionIndividualRecord): Family => {
//   const parent1 = record.arraySelect()[0];
//   const fam = parent1.getFamilyAsSpouse();
//   // console.log(victoria.getName().getNickname().value());
//   // console.log(fam.getHusband().getIndividualRecord().getName().value());
//   // console.log(fam.getChild().getIndividualRecord().getName().value());
//   const parent2 = fam.getHusband().getIndividualRecord();

//   const result = {
//     parents: [...mapRecordToNode([])(parent1), ...mapRecordToNode([])(parent2)],
//     children: fam
//       .getChild()
//       .getIndividualRecord()
//       .arraySelect()
//       .flatMap(mapRecordToNode([parent1, parent2])),
//   };

//   // const x = fam.getChild().getIndividualRecord().arraySelect();
//   // const x = fam.getChild().getIndividualRecord().getFamilyAsSpouse();

//   if (fam.getChild().length > 0) {
//     console.log(fam.getChildrenCount(), fam.getChild().length);
//   }

//   return result;
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
export const loadGedcom = async (): Promise<
  (NodeDefinition | EdgeDefinition)[]
> => {
  const gedcom = await fetch("https://mon.arbre.app/gedcoms/royal92.ged")
    // const gedcom = await fetch("/cytocom/example.ged")
    .then((r) => r.arrayBuffer())
    .then(readGedcom);

  // console.log(gedcom.getHeader().toString());
  // console.log(gedcom.toString());
  // console.log(gedcom.getIndividualRecord().getName());
  // console.log(gedcom.getIndividualRecord().getName().value());
  // const victoria = gedcom.getIndividualRecord().arraySelect()[0];

  const families = gedcom.getFamilyRecord();
  // console.log(families.arraySelect().slice(0, 3));

  // const fam = victoria.getFamilyAsSpouse();
  // console.log(victoria.getName().getNickname().value());
  // console.log(fam.getHusband().getIndividualRecord().getName().value());
  // console.log(fam.getChild().getIndividualRecord().getName().value());
  // const parent2 = fam.getHusband().getIndividualRecord();
  // const result = {
  //   parents: [
  //     ...mapRecordToNode([])(victoria),
  //     ...mapRecordToNode([])(parent2),
  //   ],
  //   children: fam
  //     .getChild()
  //     .getIndividualRecord()
  //     .arraySelect()
  //     .flatMap(mapRecordToNode([victoria, parent2])),
  // };
  // const result = mapFamilyAsSpouse(victoria);

  const mappedFamilies = families.arraySelect().slice(0, 10).map(mapFamily);
  const result = mappedFamilies.reduce<(NodeDefinition | EdgeDefinition)[]>(
    (acc, next) => {
      return [...acc, ...next.parents, ...next.children];
    },
    []
  );
  // console.log(x, result);

  // const result = mapFamily(families.arraySelect()[0]);

  // console.log(JSON.stringify(result, null, 2));
  return result;
};
