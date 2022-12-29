import { FC } from "react";
import { MappedNames } from "../gedcom/mapNames";
import { NamesList } from "./NamesList";

interface NodeData {
  names: MappedNames[];
  image: string;
  sources: string[];
  s: string;
  birthDateString: string;
  deathDateString: string;
  id: string;
  url: string | undefined;
}

const getGenderSign = (s: string): string => {
  if (s === "M") {
    return "♂️";
  }
  if (s === "F") {
    return "♀️";
  }
  return "";
};

export const IndivDetails: FC<{
  nodeData: NodeData;
  images: Record<string, string>;
  sources: Record<string, string>;
}> = ({ nodeData, images, sources }) => {
  return (
    <div>
      <NamesList names={nodeData.names} />
      {nodeData.image && images && (
        <p>
          <img src={images[nodeData.image]} width="195" alt="" />
        </p>
      )}
      {getGenderSign(nodeData.s)}
      <p>🚼 {nodeData.birthDateString ?? ""}</p>
      {nodeData.deathDateString ? `✝️ ${nodeData.deathDateString}` : ""}
      <p>
        Sources:{" "}
        {nodeData.sources
          .map((source: string) => {
            return sources ? sources[source] : "";
          })
          .join(", ")}
      </p>
      {nodeData.url && <a href={nodeData.url}>{nodeData.url}</a>}
      <p className="small">ID: {nodeData.id}</p>
      <p className="small">¹ birth name</p>
    </div>
  );
};
