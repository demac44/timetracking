import type { TimeRange } from "@/app/types/time-range";
import { MINUTES_PER_DAY } from "./parse";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(dateValue: string, days: number) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return toDateInputValue(new Date(year, month - 1, day + days));
}

export function toLocalDate(dateValue: string, minutes: number) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day, 0, minutes);
}

export function getMinutesOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function buildTimeRange(dateValue: string, startMinutes: number, endMinutes: number): TimeRange {
  const endsNextDay = endMinutes < startMinutes;
  const start = toLocalDate(dateValue, startMinutes);
  const end = toLocalDate(dateValue, endMinutes + (endsNextDay ? MINUTES_PER_DAY : 0));

  return {
    start,
    end,
    endsNextDay,
    durationMinutes: Math.round((end.getTime() - start.getTime()) / 60_000),
  };
}

export function splitLocal(iso: string) {
  const date = new Date(iso);
  return { date: toDateInputValue(date), minutes: getMinutesOfDay(date) };
}

export function roundDownToQuarter(minutes: number) {
  return minutes - (minutes % 15);
}
