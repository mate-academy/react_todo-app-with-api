export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type CreateTodoFragment = {
  userId: number;
  title: string;
  completed: boolean;
};
