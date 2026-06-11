export function minutesToMs(minutes) {
  return minutes * 60 * 1000;
}

export function toTimeString(date) {
  return date.toTimeString().slice(0, 5);
}

export function parseDayTime(date, time) {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutesToMs(minutes));
}
