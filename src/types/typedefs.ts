import { ToDoServiceErrors } from '../hooks/useTodos';

export type LoadingTodo = number | 'initial' | null;

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoError =
  | (typeof ToDoServiceErrors)[keyof typeof ToDoServiceErrors]
  | null;
