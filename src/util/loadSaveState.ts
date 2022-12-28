const GEDCOM_KEY = "gedcomPath";

export const loadState = () => {
  const gedcomPath =
    localStorage.getItem(GEDCOM_KEY) ??
    "https://mon.arbre.app/gedcoms/royal92.ged";
  return {
    gedcomPath,
  };
};

export const saveState = ({ gedcomPath }: { gedcomPath: string }) => {
  localStorage.setItem(GEDCOM_KEY, gedcomPath);
};
