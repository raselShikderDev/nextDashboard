export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center">
      <p className="text-6xl font-bold text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <p className="text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
}