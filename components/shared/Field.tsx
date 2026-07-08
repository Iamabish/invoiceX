
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="ui-label">{label}</span>
      {children}
    </label>
  );
}


export default Field