import { EdgeDefinition, NodeDefinition } from "cytoscape";

export interface Family {
  parents: (NodeDefinition | EdgeDefinition)[];
  children: (NodeDefinition | EdgeDefinition)[];
}
