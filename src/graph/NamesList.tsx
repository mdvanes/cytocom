import { FC } from "react";
import { MappedNames } from "../gedcom/mapNames";

const NameListItem: FC<{ name: MappedNames }> = ({ name }) => {
  const nick = name.nick ? `"${name.nick}"` : "";
  const type = name.type === "birth" ? "¹" : "";
  return (
    <>
      {name.given} {nick} <em>{name.sur}</em>
      {type}
    </>
  );
};

export const NamesList: FC<{ names: MappedNames[] }> = ({ names }) => {
  const primaryName =
    names.length > 0 ? (
      <h2>
        <NameListItem name={names[0]} />
      </h2>
    ) : (
      <></>
    );

  const otherNames =
    names.length > 1 ? (
      <ul>
        {names.slice(1).map((n) => (
          <li key={n.given}>
            <NameListItem name={n} />
          </li>
        ))}
      </ul>
    ) : (
      <></>
    );

  return (
    <>
      {primaryName}
      {otherNames}
    </>
  );
};
