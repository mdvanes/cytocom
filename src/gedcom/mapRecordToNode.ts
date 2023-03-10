import { EdgeDefinition, NodeDefinition } from "cytoscape";
import {
  SelectionIndividualEvent,
  SelectionIndividualRecord,
} from "read-gedcom";
import { ADOPTED, ASSOCIATION } from "../constants";
import { isDefined } from "../util/isDefined";
import { getAdoptiveParentIds } from "./getAdoptiveParentIds";
import { mapNames, MappedNames } from "./mapNames";

const getRenderedFirstName = (names: MappedNames[]): string => {
  if (names.length === 0) {
    return "";
  }
  const { nick, given, value } = names[0];
  if (nick) {
    return nick;
  }
  if (given) {
    return given.split(" ")[0].trim();
  }
  return value.split(" ")[0].trim();
};

const getRenderedLastName = (names: MappedNames[]): string | undefined => {
  if (names.length === 0) {
    return "";
  }
  const { sur } = names[0];

  if (sur) {
    return sur.trim();
  }
  return;
};

// NOTE: used as Node label
const getRenderedName = (names: MappedNames[], showLast: boolean): string => {
  const first = getRenderedFirstName(names);
  const last = getRenderedLastName(names);

  if (showLast && last) {
    return `${first}\n${last}`;
  }
  return first;
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
  const valueAsDate = familyEvent.getDate().valueAsDate()[0];
  if (valueAsDate && "date" in valueAsDate) {
    return valueAsDate.date.year.value;
  }

  // @ts-expect-error
  if (valueAsDate?.isDateRange && valueAsDate?.dateAfter?.year?.value) {
    // @ts-expect-error dateAfter is the earliest date, dateBefore is the highest date.
    return valueAsDate.dateAfter?.year?.value;
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

const getDeathDateString = (
  rec: SelectionIndividualRecord
): string | undefined => {
  const str = rec.getEventDeath().getDate().value()[0];
  if (str) {
    return str;
  }
  if (rec.getEventDeath().valueAsHappened()[0]) {
    return "unknown";
  }
  return undefined;
};

export const getShowLast = () => {
  const item = localStorage.getItem("showLast");
  return item === "true";
};

export const mapRecordToNode =
  (parents: SelectionIndividualRecord[]) =>
  (record: SelectionIndividualRecord): (NodeDefinition | EdgeDefinition)[] => {
    const s = `${record.getSex().value()[0]}`;
    const pointer = record.pointer()[0];

    if (!pointer) {
      return [];
    }

    const adoptiveParentIds = getAdoptiveParentIds(record);
    const mappedNames = getRenderedNames(record);

    const showLast = getShowLast();

    const node = {
      data: {
        id: pointer,
        name: getRenderedName(mappedNames, showLast),
        names: mappedNames,
        s,
        color: getColor(s),
        birthDateString: record.getEventBirth().getDate().value()[0],
        birthYear: getYear(record.getEventBirth()),
        deathDateString: getDeathDateString(record),
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
        const isAdopted = adoptiveParentIds.indexOf(parentPointer) > -1;
        return {
          data: {
            id: `${parentPointer}-${pointer}`,
            source: `${parentPointer}`,
            target: `${pointer}`,
            label: isAdopted ? ADOPTED : undefined,
            style: isAdopted ? "dashed" : "solid",
          },
        };
      })
      .filter(isDefined);

    const edgesToAssociations = record
      .getAssociation()
      .arraySelect()
      .map((asso) => {
        const assoPointer = asso.valueNonNull()[0];
        return {
          data: {
            id: `${assoPointer}-${pointer}`,
            source: `${assoPointer}`,
            target: `${pointer}`,
            label: `${asso.getRelation().valueNonNull()[0]}`.toLowerCase(),
            type: ASSOCIATION,
          },
        };
      });

    return [node, ...edgesToParents, ...edgesToAssociations];
  };
