import { EdgeDefinition, NodeDefinition } from "cytoscape";
import {
  SelectionIndividualEvent,
  SelectionIndividualRecord,
} from "read-gedcom";
import { mapNames, MappedNames } from "./mapNames";

// NOTE: used for Node label
const getRenderedName = (names: MappedNames[]): string => {
  if (names.length === 0) {
    return "";
  }
  const { nick, given } = names[0];
  if (nick) {
    return nick;
  }
  return given.split(" ")[0].trim();
};
// const getRenderedName = (rec: SelectionIndividualRecord): string => {
//   console.log(rec.getName().toString());
//   // console.log(
//   //   rec.getName().value(),
//   //   rec.getName().valueAsParts(),
//   //   rec.getName().getSurname().value(),
//   //   rec.getName().getNickname(),
//   //   rec.getName().getType().value()
//   // );

//   const allNames = rec.getName().arraySelect();
//   // console.log(x);
//   // x[0].
//   allNames.map((n, i) => console.log(i, JSON.stringify(mapNames(n), null, 2)));
//   // testFn(x[0]);

//   const names =
//     rec.getName().getNickname().value()[0] ??
//     rec.getName().getGivenName().value()[0] ??
//     rec.getName().value()[0] ??
//     "";
//   // TODO this is making the invalid assumption that a single name can't contain a space, e.g. "Mette Marit" or "Pa Salt" are counter examples.
//   if (names.indexOf(" ") > -1) {
//     return names.split(" ")[0];
//   }
//   return names;
// };

const getRenderedNames = (rec: SelectionIndividualRecord): MappedNames[] => {
  const allNames = rec.getName().arraySelect();
  // allNames.map((n, i) => console.log(i, JSON.stringify(mapNames(n), null, 2)));
  return allNames.map(mapNames);
  // const allMappedNames = allNames.map(mapNames).map((n) => (
  //   <li>
  //     <strong>{n.sur}</strong>
  //   </li>
  // ));
  // // ¹ for birth name

  // // const nick = rec.getName().getNickname().value()[0];
  // // const nickFormatted = nick ? `"${nick}"` : "";
  // // // return `${rec.getName().getGivenName().value()[0] ?? ""} ${nickFormatted} ${
  // // //   rec.getName().value()[0]
  // // // }`.trim();
  // // return `${nickFormatted} ${rec.getName().value()[0]}`.trim();
  // return <ul>{allMappedNames}</ul>;
};

const getColor = (s?: string): string | undefined => {
  if (s === "F") {
    return "#ff6d91";
  }
  if (s === "M") {
    return "#8cb4ff";
  }
  return "#ccc";
};

const getYear = (familyEvent: SelectionIndividualEvent): number => {
  const birthValueAsDate = familyEvent.getDate().valueAsDate()[0];
  if (birthValueAsDate && "date" in birthValueAsDate) {
    return birthValueAsDate.date.year.value;
  }
  return 0;
};

export const mapRecordToNode =
  (parents: SelectionIndividualRecord[]) =>
  (record: SelectionIndividualRecord): (NodeDefinition | EdgeDefinition)[] => {
    const s = `${record.getSex().value()[0]}`;
    const pointer = `${record.pointer()[0]}`;

    const mappedNames = getRenderedNames(record);

    const node = {
      data: {
        id: pointer,
        name: getRenderedName(mappedNames),
        names: mappedNames,
        s,
        color: getColor(s),
        birthDateString: record.getEventBirth().getDate().value()[0],
        birthYear: getYear(record.getEventBirth()),
        deathDateString: record.getEventDeath().getDate().value()[0],
        deathYear: getYear(record.getEventDeath()),
        sources: record.getSourceCitation().value(),
        image: record.getMultimedia().value()[0],
      },
    };

    const edgesToParents = parents.map((parent) => {
      const parentPointer = `${parent.pointer()[0]}`;
      return {
        data: {
          id: `${parentPointer}-${pointer}`,
          source: `${parentPointer}`,
          target: `${pointer}`,
        },
      };
    });

    return [node, ...edgesToParents];
  };
