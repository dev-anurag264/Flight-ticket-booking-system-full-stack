const ERROR_COPY = {
  NETWORK: {
    title: "Can't reach Website right now",
    description: "Check your connection and try again.",
  },
  UNAUTHORIZED: {
    title: "Your session has expired",
    description: "Please log in again to continue.",
  },
  FORBIDDEN: {
    title: "This isn't available to you",
    description: "You may not have permission to view this.",
  },
  NOT_FOUND: {
    title: "We couldn't find that",
    description: "It may have been removed or the link is incorrect.",
  },
  SEAT_CONFLICT: {
    title: "That seat was just taken",
    description: "Please choose a different seat.",
  },
  GENERIC: {
    title: "Something went wrong",
    description: "Please try again in a moment.",
  },
};

export function classifyError(err) {
  if (!err?.response) return "NETWORK";
  const status = err.response.status;
  const message = err.response.data?.message || "";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409 && message.toLowerCase().includes("seat"))
    return "SEAT_CONFLICT";
  return "GENERIC";
}

export default function ErrorState({ error, action }) {
  const kind = classifyError(error);
  const copy = ERROR_COPY[kind];
  return (
    <div className="bg-rose-50 border border-rose-600/20 rounded-(--radius-card) p-4">
      <p className="text-rose-600 font-medium text-sm">{copy.title}</p>
      <p className="text-ink-600 text-sm mt-0.5">{copy.description}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
