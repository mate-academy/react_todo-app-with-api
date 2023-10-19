import { Todo, TodosListType } from './todosTypes';

interface Load {
  type: 'LOAD',
  payload: TodosListType,
}

interface Post {
  type: 'POST',
  payload: Todo,
}

interface Delete {
  type: 'DELETE',
  payload: number,
}

interface Patch {
  type: 'PATCH',
  payload: Todo,
}

interface IsSpinning {
  type: 'IS_SPINNING',
  payload: number,
}

interface RemoveSpinning {
  type: 'REMOVE_SPINNING',
  payload: number,
}

export type Actions = Load | Post | Delete
| Patch | IsSpinning | RemoveSpinning;
