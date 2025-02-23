import { FilterStatus } from './FilterStatus';
import { Todo } from './Todo';

export enum ActionType {
  SetTodos = 'setTodos',
  SetFilter = 'setFilter',
  SetErrorMessage = 'setErrorMessage',
  DeleteTodo = 'deleteTodo',
  SetIsInputFocused = 'setInputFocus',
  SetTempTodo = 'setTempTodo',
  SetIsItemCurentlyLoading = 'setIsItemCurentlyLoading',
  setLoadingItemIds = 'setCurrentlyLoadingItemId',
  ToggleTodoStatus = 'toggleTodoStatus',
}

export type Action =
  | { type: ActionType.SetTodos; payload: Todo[] }
  | { type: ActionType.SetFilter; payload: FilterStatus }
  | { type: ActionType.SetErrorMessage; payload: string }
  | { type: ActionType.DeleteTodo; payload: number }
  | { type: ActionType.SetIsInputFocused; payload: boolean }
  | { type: ActionType.SetTempTodo; payload: Todo | null }
  | { type: ActionType.setLoadingItemIds; payload: number[] }
  | { type: ActionType.ToggleTodoStatus; payload: number };
