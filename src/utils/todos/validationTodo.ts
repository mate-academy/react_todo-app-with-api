import { Todo } from '../../types/Todo';

export const validUpdatedTodos = (updatedTodos: (Todo | void)[]): Todo[] =>
  updatedTodos.filter((todo): todo is Todo => todo !== undefined);

export const validTodoIds = (todoIds: (number | void)[]): number[] =>
  todoIds.filter((id): id is number => id !== undefined);
