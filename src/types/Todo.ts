export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoToAdd = Pick<Todo, 'userId' | 'title' | 'completed' >;
export type CompletedTodoChange = Pick<Todo, 'completed' >;
