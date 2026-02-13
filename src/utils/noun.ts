const SINGULAR_COUNT = 1;

export const getNoun = (
  count: number,
  [singular, plural]: [string, string],
): string => {
  return count === SINGULAR_COUNT ? singular : plural;
};
