export default function AuthLayout({ children }) {
  return (
    <div className="flex-1 flex flex-col min-h-screen page-enter">
      {children}
    </div>
  );
}
