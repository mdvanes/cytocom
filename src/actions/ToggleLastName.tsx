import { FC } from "react";
import { getShowLast } from "../gedcom/mapRecordToNode";

export const ToggleLastName: FC = () => {
  const showLast = getShowLast();
  return (
    <input
      type="checkbox"
      id="toggle-last-name"
      className="secondary"
      checked={showLast}
      onClick={() => {
        localStorage.setItem("showLast", showLast ? "false" : "true");
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      }}
    />
  );
};
