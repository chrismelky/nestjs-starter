export function getSkip(page: number, perPage: number) {
  return ((page || 1) - 1) * (perPage || 10);
}
