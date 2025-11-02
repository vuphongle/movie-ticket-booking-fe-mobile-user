export function formatGraphicLabel(values?: string[]): string {
  if (!values || !values.length) return '';
  return values.map(v => v.replace(/_/g, ' ').trim()).join(', ');
}
