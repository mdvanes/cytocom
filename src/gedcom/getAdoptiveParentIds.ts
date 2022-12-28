import { SelectionIndividualRecord } from "read-gedcom";
import { mapNames } from "./mapNames";

export const getAdoptiveParentIds = (
  record: SelectionIndividualRecord
): string[] => {
  const childFamilyLinks = record.getChildFamilyLink().arraySelect();
  const adoptiveParentIds: string[] = childFamilyLinks.flatMap(
    (childFamilyLink) => {
      const linkType = childFamilyLink.getPedigreeLinkageType().valueNonNull();
      if (linkType.join(",").toLowerCase() === "adopted") {
        const parent1Id =
          childFamilyLink
            .getFamilyRecord()
            .getHusband()
            .getIndividualRecord()
            .pointer()[0] ?? "";

        const parent2Id =
          childFamilyLink
            .getFamilyRecord()
            .getWife()
            .getIndividualRecord()
            .pointer()[0] ?? "";
        return [parent1Id, parent2Id];
      }
      return [];
    }
  );

  return adoptiveParentIds;
};
