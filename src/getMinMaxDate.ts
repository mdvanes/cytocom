import { EdgeDefinition, NodeDefinition } from "cytoscape";

export const getMinMaxDate = (
  elements: (NodeDefinition | EdgeDefinition)[]
): [number, number] =>
  elements.reduce(
    (acc, next) => {
      if ("birthYear" in next.data && next.data.birthYear < acc[0]) {
        acc[0] = next.data.birthYear - 1;
      }
      if ("deathYear" in next.data && next.data.deathYear > acc[1]) {
        acc[1] = next.data.deathYear + 1;
      }
      return acc;
    },
    [Infinity, -Infinity]
  );
