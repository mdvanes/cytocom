import { SelectionIndividualRecord } from "read-gedcom";

export const getAdoptiveParentIds = (
  record: SelectionIndividualRecord
): string[] => {
  //   const childFamilyLinks = record.getChildFamilyLink().arraySelect();
  //   const adoptiveParentIds: string[] = childFamilyLinks.flatMap(
  //     (childFamilyLink) => {
  //       const linkType = childFamilyLink.getPedigreeLinkageType().valueNonNull();
  //       if (linkType.join(",").toLowerCase() === "adopted") {
  //         const parent1Id =
  //           childFamilyLink
  //             .getFamilyRecord()
  //             .getHusband()
  //             .getIndividualRecord()
  //             .pointer()[0] ?? "";

  //         const parent2Id =
  //           childFamilyLink
  //             .getFamilyRecord()
  //             .getWife()
  //             .getIndividualRecord()
  //             .pointer()[0] ?? "";
  //         return [parent1Id, parent2Id];
  //       }
  //       return [];
  //     }
  //   );
  //   return adoptiveParentIds;

  const adoptedBy = record
    .getEventAdoption()
    .getFamilyAsChildReference()
    .getAdoptedByWhom()
    .valueNonNull();

  if (adoptedBy.length > 0) {
    const family = record
      .getEventAdoption()
      .getFamilyAsChildReference()
      .getFamilyRecord();

    const husbandPointer =
      family.getHusband().getIndividualRecord().pointer()[0] ?? "";
    const wifePointer =
      family.getWife().getIndividualRecord().pointer()[0] ?? "";

    if (adoptedBy[0] === "HUSB") {
      return [husbandPointer];
    }
    if (adoptedBy[0] === "WIFE") {
      return [wifePointer];
    }
    if (adoptedBy[0] === "BOTH") {
      return [husbandPointer, wifePointer];
    }
  }

  return [];
};
