export enum Status {
  ALL = 'all',
  COMPLETED = 'completed',
  ACTIVE = 'active',
}

export type FilterOption = {
  href: string;
  testId: string;
  text: string;
};
