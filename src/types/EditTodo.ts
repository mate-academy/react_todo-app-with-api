import { Todo } from './Todo';

export type EditTodo = <T extends keyof Todo>(
  todoId: number,
  name: T,
  newValue: Todo[T],
  hasError?: () => void,
) => void;
