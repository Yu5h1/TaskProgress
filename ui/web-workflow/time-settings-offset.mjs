// Verbatim product UI conversion from the pinned TimeSettingsEditor.svelte.
// Kept in the demo adapter; never exported as a Web date/time utility.
function browserOffset() {
  const minutes = -new Date().getTimezoneOffset();
  const sign = minutes >= 0 ? "+" : "-";
  const absolute = Math.abs(minutes);
  return `${sign}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`;
}

export function zoneOffset(local, timeZone) {
  try {
    const [datePart, timePart] = local.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
    const intended = Date.UTC(year, month - 1, day, hour, minute);
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const offsetAt = (instant) => {
      const parts = Object.fromEntries(
        formatter.formatToParts(new Date(instant))
          .filter((part) => part.type !== "literal")
          .map((part) => [part.type, Number(part.value)]),
      );
      return Math.round((Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
      ) - instant) / 60000);
    };
    let offset = offsetAt(intended);
    offset = offsetAt(intended - offset * 60000);
    const sign = offset >= 0 ? "+" : "-";
    const absolute = Math.abs(offset);
    return `${sign}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`;
  } catch {
    return browserOffset();
  }
}
