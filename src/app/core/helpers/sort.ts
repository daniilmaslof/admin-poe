/**
 * Sort an array of objects by key.
 * @param array Array.
 * @param key Sort key.
 * @param asc Sort direction.
 */
export function clientSideSort<T, K extends keyof T>(array: T[], key: string, asc: boolean = true): T[] {
  const sign = asc ? 1 : -1;
  return array.sort((a, b) => {
    if (a[key] < b[key]) {
      return -1 * sign;
    }
    if (a[key] > b[key]) {
      return 1 * sign;
    }
    return 0;
  });
}
