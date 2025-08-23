export interface CommandUnit {
  readonly type:
    | "createSystemNode"
    | "createUserNode"
    | "createAINode"
    | "deleteSystemNode"
    | "deleteUserNode"
    | "deleteAINode"
    | "updateNodeContent"
    | "updateNodeRenderingProperty"
    | "updateParentNode"
    | "appendChildNode"
    | "removeChildNode"
    | "updateAINodeProperty"
    | "requestAINodeCalculation"
    | "startAINodeCalculation"
    | "completeAINodeCalculation"
    | "errorAINodeCalculation"
    | "retryAINodeCalculation";
}
