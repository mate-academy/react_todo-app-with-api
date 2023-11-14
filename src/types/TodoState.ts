import { ErrorType } from './ErrorType';
import { Todo } from './Todo';
import { TodoFilter } from './TodoFilter';

export interface TodoState {
  todos: Todo[];
  tempTodo: Todo | null;
  inputValue: string,
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  currentFilter: TodoFilter;
  errorType: ErrorType | null;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  completingTodoIds: number[],
  renamingTodoId: number | null;
}
