import { Todo } from './Todo';

export type ChangeTodo = <T extends keyof Todo> (
  todoId: number,
  name: T,
  newValue: Todo[T],
  isError?: () => void,
) => void;
