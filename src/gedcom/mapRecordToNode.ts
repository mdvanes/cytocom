import { EdgeDefinition, NodeDefinition } from "cytoscape";
import {
  SelectionIndividualEvent,
  SelectionIndividualRecord,
} from "read-gedcom";
import { isDefined } from "../util/isDefined";
import { getAdoptiveParentIds } from "./getAdoptiveParentIds";
import { mapNames, MappedNames } from "./mapNames";

// NOTE: used as Node label
const getRenderedName = (names: MappedNames[]): string => {
  if (names.length === 0) {
    return "";
  }
  const { nick, given, sur } = names[0];
  if (nick) {
    return nick;
  }
  if (given) {
    return given.split(" ")[0].trim();
  }
  return sur;
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

// Return GRAMPS style URL
const getUrl = (rec: SelectionIndividualRecord): string | undefined => {
  const wwwList = rec.get("WWW").valueNonNull();
  const www = wwwList.length > 0 ? wwwList[0] : undefined;
  const objectFileList = rec.get("OBJE").get("FILE").valueNonNull();
  const objectFile = objectFileList.length > 0 ? objectFileList[0] : undefined;
  return www || objectFile;
};

export const mapRecordToNode =
  (parents: SelectionIndividualRecord[]) =>
  (record: SelectionIndividualRecord): (NodeDefinition | EdgeDefinition)[] => {
    const s = `${record.getSex().value()[0]}`;
    const pointer = `${record.pointer()[0]}`;

    const adoptiveParentIds = getAdoptiveParentIds(record);
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
        url: getUrl(record),
      },
    };

    const edgesToParents = parents
      .map((parent) => {
        const parentPointer = parent.pointer()[0];
        if (!parentPointer) {
          return undefined;
        }
        return {
          data: {
            id: `${parentPointer}-${pointer}`,
            source: `${parentPointer}`,
            target: `${pointer}`,
            style:
              adoptiveParentIds.indexOf(parentPointer) > -1
                ? "dashed"
                : "solid",
          },
        };
      })
      .filter(isDefined);

    return [node, ...edgesToParents];
  };
