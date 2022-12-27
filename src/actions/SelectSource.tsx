import { CollectionReturnValue } from "cytoscape";
import { FC, useState } from "react";

export interface Props {
  cy?: cytoscape.Core;
  sources?: Record<string, string>;
}

export const SelectSource: FC<Props> = ({ cy, sources }) => {
  const [selectedSource, setSelectedSource] = useState<string>();
  const [removedForSource, setRemovedForSource] =
    useState<CollectionReturnValue>();

  const handleSourceChange: React.ChangeEventHandler<HTMLSelectElement> = (
    evt
  ) => {
    if (removedForSource) {
      removedForSource.restore();
    }

    const newSource = evt.target.value;
    setSelectedSource(newSource);

    if (cy && newSource) {
      const result = cy
        .filter((elem) => {
          if (!elem.isNode()) {
            return false;
          }

          return elem.data("sources").indexOf(newSource) === -1;
        })
        .remove();
      // TODO this bugs when two filters are combined
      setRemovedForSource(result);
    }
  };

  return (
    <div>
      <select name="sources" id="sources" onChange={handleSourceChange}>
        <option value="">none</option>
        {sources &&
          Object.entries(sources).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
      </select>
      {selectedSource &&
        sources &&
        ` ${selectedSource} ${sources[selectedSource]}`}
    </div>
  );
};
