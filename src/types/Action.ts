import { ActionType } from './ActionType';
import { Todo } from './Todo';

export type Action =
  | { type: ActionType.GetTodos; payload: Todo[] }
  | { type: ActionType.Delete; payload: number }
  | { type: ActionType.SetCompleted; payload: number }
  | { type: ActionType.Add; payload: Todo }
  | { type: ActionType.ClearCompleted }
  | { type: ActionType.SetCompletedAll }
  | { type: ActionType.SetFilterActive }
  | { type: ActionType.SetFilterCompleted }
  | { type: ActionType.SetFilterAll }
  | { type: ActionType.EditTitle; payload: { id: number; title: string } };
