import { Todo } from './Todo';
import { Actions } from './Actions';
import { Errors } from './enums/Errors';

export interface TodosState {
  todos: Todo[];
  dispatcher: (act: Actions) => void;
  errorType: Errors | null;
  tempTodo: Todo | null;
  activeTodoIds: number[];
  clearErrorMessage: () => void;
}
