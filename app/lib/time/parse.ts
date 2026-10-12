export const MINUTES_PER_DAY = 24 * 60;

const COMPACT_TIME = /^(\d{1,4})\s*(a|am|p|pm)?$/;
const SEPARATED_TIME = /^(\d{1,2})[:.](\d{2})\s*(a|am|p|pm)?$/;
const CLOCK_DURATION = /^(\d+):(\d{2})$/;
const UNIT_DURATION = /^(?:(\d+(?:[.,]\d+)?)\s*h(?:rs?|ours?)?)?\s*(?:(\d+)\s*(?:m(?:in(?:s|utes?)?)?)?)?$/;

function splitCompact(digits: string) {
  if (digits.length <= 2) {
    return { hours: Number(digits), minutes: 0 };
  }

  return { hours: Number(digits.slice(0, -2)), minutes: Number(digits.slice(-2)) };
}

function applyMeridiem(hours: number, meridiem: string | undefined) {
  if (!meridiem) {
    return hours;
  }

  if (hours < 1 || hours > 12) {
    return null;
  }

  const isPm = meridiem.startsWith("p");
  return (hours % 12) + (isPm ? 12 : 0);
}

export function parseTimeOfDay(input: string) {
  const value = input.trim().toLowerCase();
  const separated = SEPARATED_TIME.exec(value);
  const compact = separated ? null : COMPACT_TIME.exec(value);

  if (!separated && !compact) {
    return null;
  }

  const { hours: rawHours, minutes } = separated
    ? { hours: Number(separated[1]), minutes: Number(separated[2]) }
    : splitCompact(compact![1]);
  const hours = applyMeridiem(rawHours, separated ? separated[3] : compact![2]);

  if (hours === null || hours > 23 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

export function parseDuration(input: string) {
  const value = input.trim().toLowerCase();

  if (!value) {
    return null;
  }

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  if (/^\d*[.,]\d+$/.test(value)) {
    return Math.round(Number(value.replace(",", ".")) * 60);
  }

  const clock = CLOCK_DURATION.exec(value);

  if (clock) {
    const minutes = Number(clock[2]);
    return minutes > 59 ? null : Number(clock[1]) * 60 + minutes;
  }

  const units = UNIT_DURATION.exec(value);

  if (!units || (units[1] === undefined && units[2] === undefined)) {
    return null;
  }

  const hours = units[1] ? Number(units[1].replace(",", ".")) : 0;
  const minutes = units[2] ? Number(units[2]) : 0;

  return Math.round(hours * 60) + minutes;
}

export function formatTimeOfDay(minutes: number) {
  const normalized = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(normalized / 60);

  return `${String(hours).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")}`;
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) {
    return `${rest}m`;
  }

  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}
