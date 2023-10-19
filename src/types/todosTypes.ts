export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  isSpinned?: boolean;
}

export type TodosListType = Todo[];
