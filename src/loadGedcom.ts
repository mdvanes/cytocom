import { Family } from "./types";
import { readGedcom } from "read-gedcom";
import { mapRecordToNode } from "./mapRecordToNode";

// https://docs.arbre.app/read-gedcom/pages/basic-examples.html
export const loadGedcom = async (): Promise<Family> => {
  const gedcom = await fetch("https://mon.arbre.app/gedcoms/royal92.ged")
    // const gedcom = await fetch("/example.ged")
    .then((r) => r.arrayBuffer())
    .then(readGedcom);

  // console.log(gedcom.getHeader().toString());
  // console.log(gedcom.toString());
  // console.log(gedcom.getIndividualRecord().getName());
  // console.log(gedcom.getIndividualRecord().getName().value());
  const victoria = gedcom.getIndividualRecord().arraySelect()[0];
  const fam = victoria.getFamilyAsSpouse();
  // console.log(victoria.getName().getNickname().value());
  // console.log(fam.getHusband().getIndividualRecord().getName().value());
  // console.log(fam.getChild().getIndividualRecord().getName().value());
  const result = {
    parents: [
      mapRecordToNode(victoria),
      mapRecordToNode(fam.getHusband().getIndividualRecord()),
    ],
    children: fam
      .getChild()
      .getIndividualRecord()
      .arraySelect()
      .map(mapRecordToNode),
  };
  // console.log(JSON.stringify(result, null, 2));
  return result;
};
