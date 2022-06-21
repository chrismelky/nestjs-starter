export function getSkip(page: number, size: number) {
  return ((page || 1) - 1) * (size || 10);
}
