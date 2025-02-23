import { Todo } from './Todo';

export type TodoAction =
  | { type: 'getTodos'; payload: Todo[] }
  | { type: 'addTodo'; payload: Todo }
  | { type: 'updateTodo'; payload: Todo }
  | { type: 'deleteTodo'; payload: number }
  | { type: 'clearCompletedTodos' }
  | { type: 'toggleStatus'; payload: number }
  | { type: 'toggleStatusAll' };
