import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function Body() {
  return (
    <>
      <ReactFlowProvider>
        <ReactFlow nodes={[]} edges={[]} />
        <Background gap={20} size={1} />
        <Controls className="bg-white border border-gray-200 rounded-lg shadow-sm" />
      </ReactFlowProvider>
    </>
  );
}
