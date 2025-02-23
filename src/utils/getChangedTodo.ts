import { Todo } from '../types/Todo';

export const getChangedTodo = (
  todo: Todo,
  todoField: keyof Todo,
  newValue: string | boolean,
): Todo => ({
  ...todo,
  [todoField]: newValue,
});
