import { SORT } from './SortEnum';
import { Todo } from './Todo';

export interface IContext {
  todos: Todo[];
  sortField: SORT;
  error: string;
  updateSortField: (term: SORT) => void;
  onCloseError: () => void;
  todoLoading: boolean;
  tempTodo: Todo | null;
  onAddNewTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => Promise<number | void>;
  toggleStatus: (todoId: number) => Promise<Todo | void>;
  toggleAll: () => void;
  togglingLoading: boolean;
  onClearCompleted: () => void;
  loadedId: number[];
  updateTodo: (id: number, newTitle: string) => Promise<number | void>;
  areClearing: boolean;
  updateError: (error: string) => void;
}
