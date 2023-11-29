import { ErrorType } from './ErrorType';
import { Todo } from './Todo';
import { TodoFilter } from './TodoFilter';

export interface TodoState {
  todos: Todo[];
  tempTodo: Todo | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  errorType: ErrorType | null;
  isErrorVisible: boolean;
  currentFilter: TodoFilter;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  completingTodoIds: number[],
  renamingTodoId: number | null;
}
