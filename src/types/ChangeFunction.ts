import { Todo } from './Todo';

export type ChangeFunction = <T extends keyof Todo> (
  todoId: number,
  propName: T,
  newPropValue: Todo[T],
  onError?: () => void,
) => void;
