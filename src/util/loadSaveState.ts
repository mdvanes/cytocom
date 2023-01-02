const GEDCOM_CONTENT_KEY = "gedcomContent";

export const loadState = () => {
  const gedcomContent =
    localStorage.getItem(GEDCOM_CONTENT_KEY) ??
    "";
  return {
    gedcomContent,
  };
};

export const saveState = ({ gedcomContent }: { gedcomContent: string }) => {
  localStorage.setItem(GEDCOM_CONTENT_KEY, gedcomContent);
};
