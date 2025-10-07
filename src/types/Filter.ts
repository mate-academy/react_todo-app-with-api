export enum FILTER {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export type Filter = FILTER.All | FILTER.Active | FILTER.Completed;
