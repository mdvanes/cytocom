import { EdgeDefinition, NodeDefinition } from "cytoscape";
import {
  SelectionIndividualEvent,
  SelectionIndividualRecord,
} from "read-gedcom";
import { ADOPTED, ASSOCIATION } from "../constants";
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
    const pointer = record.pointer()[0];

    if (!pointer) {
      return [];
    }

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
