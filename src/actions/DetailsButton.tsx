import { FC } from "react";

export interface Props {
  setShowDetails: (fn: (b: boolean) => boolean) => void;
}

export const DetailsButton: FC<Props> = ({ setShowDetails }) => {
  return (
    <button
      id="mybutton"
      className="secondary"
      onClick={() => {
        setShowDetails((prev) => !prev);
      }}
    >
      details
    </button>
  );
};
