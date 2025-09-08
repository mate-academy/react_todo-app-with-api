export type TodoId = number;
export interface Todo {
  id: TodoId;
  userId: number;
  title: string;
  completed: boolean;
}
