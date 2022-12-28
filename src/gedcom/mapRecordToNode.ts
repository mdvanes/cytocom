import { EdgeDefinition, NodeDefinition } from "cytoscape";
import {
  SelectionIndividualEvent,
  SelectionIndividualRecord,
} from "read-gedcom";
import { mapNames, MappedNames } from "./mapNames";

// NOTE: used as Node label
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

const getRenderedNames = (rec: SelectionIndividualRecord): MappedNames[] => {
  const allNames = rec.getName().arraySelect();
  return allNames.map(mapNames);
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
