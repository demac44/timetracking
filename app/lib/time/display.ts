const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });
const dayFormat = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short" });
const fullDayFormat = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" });
const fullFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "long" });

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function getDayDifference(from: Date, to: Date) {
  return Math.round((startOfDay(to) - startOfDay(from)) / 86_400_000);
}

export function formatTime(date: Date) {
  return timeFormat.format(date);
}

export function formatDay(date: Date, now = new Date()) {
  const difference = getDayDifference(date, now);

  if (difference === 0) {
    return "Today";
  }

  if (difference === 1) {
    return "Yesterday";
  }

  return date.getFullYear() === now.getFullYear() ? dayFormat.format(date) : fullDayFormat.format(date);
}

export function formatDayAndTime(date: Date, now = new Date()) {
  return `${formatDay(date, now)}, ${formatTime(date)}`;
}

export function formatFull(date: Date) {
  return fullFormat.format(date);
}

export function getTimeZoneName() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
