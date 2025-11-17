export function formatGraphicLabel(values?: string[]): string {
  if (!values || !values.length) return "";
  return values.map((v) => v.replace(/_/g, " ").trim()).join(", ");
}

export function parseGraphicArray(graphics: string): string[] {
  if (!graphics) return [];

  return graphics
    .replace(/\[|\]/g, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
