import { EdgeDefinition, NodeDefinition } from "cytoscape";
import {
  SelectionIndividualEvent,
  SelectionIndividualRecord,
} from "read-gedcom";

const getRenderedName = (rec: SelectionIndividualRecord): string => {
  const names =
    rec.getName().getNickname().value()[0] ??
    rec.getName().getGivenName().value()[0] ??
    rec.getName().value()[0] ??
    "";
  // TODO this is making the invalid assumption that a single name can't contain a space, e.g. Mette Marit is a counter example.
  if (names.indexOf(" ") > -1) {
    return names.split(" ")[0];
  }
  return names;
};

const getRenderedNames = (rec: SelectionIndividualRecord): string => {
  const nick = rec.getName().getNickname().value()[0];
  const nickFormatted = nick ? `"${nick}"` : "";
  return `${rec.getName().getGivenName().value()[0] ?? ""} ${nickFormatted} ${
    rec.getName().value()[0]
  }`.trim();
};

const getColor = (s?: string): string | undefined => {
  if (s === "F") {
    return "#ff6d91";
  }
  if (s === "M") {
    return "#8cb4ff";
  }
  return;
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

    const node = {
      data: {
        id: pointer,
        name: getRenderedName(record),
        names: getRenderedNames(record),
        s,
        color: getColor(s),
        birthDateString: record.getEventBirth().getDate().value()[0],
        birthYear: getYear(record.getEventBirth()),
        deathDateString: record.getEventDeath().getDate().value()[0],
        deathYear: getYear(record.getEventDeath()),
        sources: record
          .getSourceCitation()
          .arraySelect()
          .flatMap((sourceCitation) => sourceCitation.value()),
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
