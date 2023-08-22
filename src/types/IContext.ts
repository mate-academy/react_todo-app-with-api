import { SORT } from './SortEnum';
import { Todo } from './Todo';
import { ERRORS } from './TodosErrors';

export interface IContext {
  todos: Todo[];
  error: ERRORS;
  onAddTodo: (newTitle: string) => void;
  updateError: (error: ERRORS) => void;
  tempTodo: Todo | null;
  todosLoading: number[];
  onCloseError: () => void;
  onDeleteTodo: (todoId: number) => void;
  toggleTodoStatus: (todoId: number) => void;
  toggleAllTodoStatus: () => void;
  clearAllActive: () => void;
  updateSortField: (sort: SORT) => void;
  sortField: SORT;
  updateTodo: (newTitle: string, id: number) => void;
}
