// eslint-disable-next-line no-redeclare, @typescript-eslint/no-redeclare
export const FilterStatus = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
} as const;

// eslint-disable-next-line no-redeclare, @typescript-eslint/no-redeclare
export type FilterStatus = (typeof FilterStatus)[keyof typeof FilterStatus];
