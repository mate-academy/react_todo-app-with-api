export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type CreateTodoDTO = Omit<Todo, 'id'>;

export interface EditTodoDTO {
  id: number;
  title?: string;
  completed?: boolean;
}
