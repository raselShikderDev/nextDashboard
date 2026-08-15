export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center">
      <p className="text-6xl font-bold text-muted-foreground">403</p>
      <h1 className="text-2xl font-semibold">Access Denied</h1>
      <p className="text-muted-foreground">
        You don't have permission to view this page.
      </p>
    </div>
  );
}