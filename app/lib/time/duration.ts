export function minutesBetween(startIso: string, endIso: string) {
  return Math.round((Date.parse(endIso) - Date.parse(startIso)) / 60_000);
}
