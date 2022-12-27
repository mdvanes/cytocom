import { FC } from "react";
import { Props as DetailsButtonProps, DetailsButton } from "./DetailsButton";
import { Props as SelectGedcomProps, SelectGedcom } from "./SelectGedcom";
import { Props as SelectLayoutProps, SelectLayout } from "./SelectLayout";
import { Props as SelectSourceProps, SelectSource } from "./SelectSource";

type Props = SelectGedcomProps &
  SelectSourceProps &
  DetailsButtonProps & { rangeSlider: JSX.Element } & SelectLayoutProps;

export const Actions: FC<Props> = ({
  setGedcomPath,
  setShowDetails,
  rangeSlider,
  cy,
  sources,
  setLayout,
}) => {
  return (
    <div className="actions">
      <SelectGedcom setGedcomPath={setGedcomPath} />
      {rangeSlider}
      <SelectSource cy={cy} sources={sources} />
      <DetailsButton setShowDetails={setShowDetails} />
      <SelectLayout cy={cy} setLayout={setLayout} />
    </div>
  );
};
