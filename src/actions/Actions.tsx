import { FC } from "react";
import { Props as DetailsButtonProps, DetailsButton } from "./DetailsButton";
import { IssuesButton } from "./IssuesButton";
import { RelayoutButton } from "./RelayoutButton";
import { Props as SelectGedcomProps, SelectGedcom } from "./SelectGedcom";
import { Props as SelectLayoutProps, SelectLayout } from "./SelectLayout";
import { Props as SelectSourceProps, SelectSource } from "./SelectSource";

type Props = SelectGedcomProps &
  SelectSourceProps &
  DetailsButtonProps & { rangeSlider: JSX.Element } & SelectLayoutProps;

export const Actions: FC<Props> = ({
  cy,
  gedcomPath,
  layout,
  rangeSlider,
  setGedcomPath,
  setLayout,
  setShowDetails,
  sources,
}) => {
  return (
    <div className="actions">
      <SelectGedcom gedcomPath={gedcomPath} setGedcomPath={setGedcomPath} />
      {rangeSlider}
      <SelectSource cy={cy} sources={sources} />
      <SelectLayout cy={cy} layout={layout} setLayout={setLayout} />
      <RelayoutButton cy={cy} layout={layout} />
      <DetailsButton setShowDetails={setShowDetails} />
      <IssuesButton />
    </div>
  );
};
