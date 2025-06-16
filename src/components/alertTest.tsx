export type AlertTestProps = {
  type: "success" | "error";
  message: string;
};

export default function AlertTest(props: AlertTestProps) {
  return (
    <div>
      {props.type === "success" ? (
        <span className="text-green-500">✓</span>
      ) : (
        <span className="text-red-500">✕</span>
      )}
      <span className="text-white">{props.message}</span>
    </div>
  );
}
