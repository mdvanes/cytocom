import { SelectionName } from "read-gedcom";

export interface MappedNames {
  type: string;
  sur: string;
  givenParts: string[];
  given: string;
  nick: string;
  prefix: string;
  value: string;
}

export const mapNames = (selectionName: SelectionName): MappedNames => {
  const type = selectionName.getType().valueNonNull();
  const surPrefixList = selectionName
    .getPrefixSurname()
    .valueNonNull()
    .join(" ");
  const surList = selectionName.getSurname().valueNonNull().join(" ");
  const sur = `${surPrefixList} ${surList}`;
  return {
    type: type.length > 0 ? type[0] : "birth",
    prefix: selectionName.getPrefixName().valueNonNull().join(", "),
    sur,
    givenParts: selectionName.getGivenName().valueNonNull(),
    given: selectionName.getGivenName().valueNonNull().join(", "),
    // nickParts: nobj.getNickname().value(),
    nick: selectionName.getNickname().valueNonNull().join(", "),
    // NOTE: call name is not in GEDCOM
    value: selectionName.value().join(" "),
  };
};
