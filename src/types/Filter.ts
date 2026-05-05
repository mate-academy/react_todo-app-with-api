export enum FilterType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export type Filter = `${FilterType}`;

export const isFilter = (value: string): value is Filter => {
  return ['all', 'active', 'completed'].includes(value);
};
