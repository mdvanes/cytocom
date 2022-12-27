import { FC } from "react";
import { Props as DetailsButtonProps, DetailsButton } from "./DetailsButton";
import { Props as SelectGedcomProps, SelectGedcom } from "./SelectGedcom";
import { Props as SelectSourceProps, SelectSource } from "./SelectSource";

type Props = SelectGedcomProps &
  SelectSourceProps &
  DetailsButtonProps & { rangeSlider: JSX.Element };

export const Actions: FC<Props> = ({
  setGedcomPath,
  setShowDetails,
  rangeSlider,
  cy,
  sources,
}) => {
  return (
    <div className="actions">
      <SelectGedcom setGedcomPath={setGedcomPath} />
      {rangeSlider}
      <SelectSource cy={cy} sources={sources} />
      <DetailsButton setShowDetails={setShowDetails} />
    </div>
  );
};
