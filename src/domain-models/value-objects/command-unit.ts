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
    | "updateAINodeProperty"
    | "requestAINodeCalculation"
    | "startAINodeCalculation"
    | "completeAINodeCalculation"
    | "errorAINodeCalculation"
    | "retryAINodeCalculation";
}
