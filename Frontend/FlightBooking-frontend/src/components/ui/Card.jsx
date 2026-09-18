export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`bg-white rounded-[var(--radius-card)] border border-slate-300/60 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }) {
  return <div className={`px-5 pt-5 ${className}`}>{children}</div>;
}

export function CardBody({ className = "", children }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ className = "", children }) {
  return (
    <div className={`px-5 pb-5 pt-3 border-t border-slate-300/60 ${className}`}>
      {children}
    </div>
  );
}
