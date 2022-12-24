import { NodeDefinition } from "cytoscape";
import { SelectionIndividualRecord } from "read-gedcom";

const getRenderedName = (rec: SelectionIndividualRecord): string => {
  console.log(
    rec,
    "| birth",
    // @ts-expect-error
    rec.getEventBirth().getDate().valueAsDate()[0].date.year.value,
    rec.getEventBirth().getDate().value()[0],
    "| death",
    rec.getEventDeath().getDate().value()[0],
    "| s",
    rec.getSex().value()[0]
  );
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

const getColor = (s?: string): string | undefined => {
  if (s === "F") {
    return "#ff6d91";
  }
  if (s === "M") {
    return "#8cb4ff";
  }
  return;
};

export const mapRecordToNode = (
  record: SelectionIndividualRecord
): NodeDefinition => {
  const s = `${record.getSex().value()[0]}`;
  console.log(record, record.pointer());
  const pointer = `${record.pointer()[0]}`;
  console.log(pointer);
  return {
    data: {
      id: pointer,
      name: getRenderedName(record),
      s,
      color: getColor(s),
    },
  };
};
