export function formatCurrency(value?: number): string {
  if (value == null) return "0 đ";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
}
