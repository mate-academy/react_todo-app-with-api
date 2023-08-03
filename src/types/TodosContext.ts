import { SORT } from './SortEnum';
import { Todo } from './Todo';

export interface IContext {
  todos: Todo[];
  sortField: SORT;
  error: string;
  updateSortField: (term: SORT) => void;
  onCloseError: () => void;
  tempTodo: Todo | null;
  onAddNewTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => Promise<number | void>;
  toggleStatus: (todoId: number) => Promise<Todo | void>;
  toggleAll: () => void;
  onClearCompleted: () => void;
  loadedId: number[];
  updateTodo: (id: number, newTitle: string) => Promise<number | void>;
  updateError: (error: string) => void;
}
