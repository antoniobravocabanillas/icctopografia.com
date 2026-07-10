export function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  if (!/[ÃÂ]/.test(value)) return value;

  try {
    return new TextDecoder("utf-8").decode(Uint8Array.from(value, (char) => char.charCodeAt(0)));
  } catch {
    return value;
  }
}

export function cleanArray(values?: readonly unknown[]): string[] {
  return (values || []).map(cleanText).filter(Boolean);
}
