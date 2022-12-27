export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FieldForFiltering {
  All,
  Active,
  Completed,
}
