import { FC } from "react";
import { MappedNames } from "../gedcom/mapNames";

const NameListItem: FC<{ name: MappedNames }> = ({ name }) => {
  const nick = name.nick ? `"${name.nick}"` : "";
  const type = name.type === "birth" ? "¹" : "";
  const fallback =
    !name.prefix && !name.given && !nick && !name.sur ? name.value : "";
  return (
    <>
      <span className="dim">{name.prefix}</span> {name.given} {nick}{" "}
      <em>{name.sur}</em>
      {fallback}
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
        {names.slice(1).map((n, i) => (
          <li key={i}>
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
