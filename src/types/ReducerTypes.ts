import { FilterField } from './FilterField';
import { Todo } from './Todo';

export enum ActionType {
  SetTodos = 'setTodos',
  SetFilterField = 'setFilterField',
  AddTodo = 'addTodo',
  DeleteTodo = 'deleteTodo',
  ModifyTodo = 'modifyTodo',
  SetErrorMessage = 'setErrorMessage',
  ClearErrorMessage = 'clearErrorMessage',
}

export interface State {
  todos: Todo[];
  filterField: FilterField;
  errorMessage: string;
}

/* eslint-disable @typescript-eslint/indent */
// had to disable linter here, because linter is conflicting with prettier on lines 28-30
export type Action =
  | { type: ActionType.SetTodos; payload: Todo[] }
  | { type: ActionType.SetFilterField; payload: FilterField }
  | { type: ActionType.AddTodo; payload: Todo }
  | { type: ActionType.DeleteTodo; payload: number }
  | {
      type: ActionType.ModifyTodo;
      payload: { todoId: number; todoProps: Partial<Todo> };
    }
  | { type: ActionType.SetErrorMessage; payload: string }
  | { type: ActionType.ClearErrorMessage };
