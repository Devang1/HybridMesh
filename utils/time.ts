export function compactTime(dateLike: string) {
  const date = new Date(dateLike);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function relativeTime(dateLike: string) {
  const diff = Date.now() - new Date(dateLike).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
