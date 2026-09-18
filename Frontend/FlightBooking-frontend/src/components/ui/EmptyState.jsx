export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      {icon && <div className="text-ink-400 mb-3">{icon}</div>}
      <p className="text-ink-900 font-medium">{title}</p>
      {description && (
        <p className="text-ink-400 text-sm mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
