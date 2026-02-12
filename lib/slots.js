import { addMinutes, format, isBefore } from "date-fns";

function parseHM(hm) {
  const [h, m] = hm.split(":").map((x) => parseInt(x, 10));
  return { h, m };
}

export function buildSlotsForDate({ dateISO, rule, durationMin, busyRanges }) {
  const { h: sh, m: sm } = parseHM(rule.startTime);
  const { h: eh, m: em } = parseHM(rule.endTime);

  const dayStart = new Date(dateISO + "T00:00:00");
  const start = new Date(dayStart);
  start.setHours(sh, sm, 0, 0);

  const end = new Date(dayStart);
  end.setHours(eh, em, 0, 0);

  const slotMin = rule.slotMin || 30;
  const slots = [];
  for (let t = new Date(start); isBefore(addMinutes(t, durationMin), addMinutes(end, 0)) || +addMinutes(t, durationMin) === +end; t = addMinutes(t, slotMin)) {
    const s = new Date(t);
    const e = addMinutes(s, durationMin);
    const overlaps = busyRanges.some((b) => !(e <= b.start || s >= b.end));
    if (!overlaps) slots.push({ start: s.toISOString(), label: format(s, "HH:mm") });
  }
  return slots;
}
