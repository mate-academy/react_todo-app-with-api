import { Todo } from './Todo';

export type PrevTodos = (todos: Todo[]) => Todo[];
export type PrevProcessingTodoIds = (todoIds: number[]) => number[];
