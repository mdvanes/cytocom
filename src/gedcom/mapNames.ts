import { SelectionName } from "read-gedcom";

export interface MappedNames {
  type: string;
  sur: string;
  givenParts: string[];
  given: string;
  nick: string;
}

export const mapNames = (selectionName: SelectionName): MappedNames => {
  const type = selectionName.getType().valueNonNull();
  return {
    type: type.length > 0 ? type[0] : "birth",
    sur: selectionName.getSurname().valueNonNull().join(", "),
    givenParts: selectionName.getGivenName().valueNonNull(),
    given: selectionName.getGivenName().valueNonNull().join(", "),
    // nickParts: nobj.getNickname().value(),
    nick: selectionName.getNickname().valueNonNull().join(", "),
    // NOTE: call name is not in GEDCOM
  };
};
