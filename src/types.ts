import { NodeDefinition } from "cytoscape";

export interface Family {
  parents: NodeDefinition[];
  children: NodeDefinition[];
}
