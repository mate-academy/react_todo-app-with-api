export type Item = {
  id: number,
  userId: number,
  title: string,
  completed: boolean,
};

export enum ActionType {
  LOAD = 'load',
  ADD = 'add',
  REMOVE = 'remove',
  UPDATE = 'update',
  UPDATE_TEMP = 'updateTemp',
  TOGGLE_ALL = 'toggleAll',
  FILTER = 'filter',
  ERROR = 'error',
  PROCESSED = 'processed',
}

export enum FilterType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export enum ErrorMessage {
  UNABLE_LOAD = 'Unable to load todos',
  UNABLE_CREATE = 'Unable to add a todo',
  UNABLE_DELETE = 'Unable to delete a todo',
  UNABLE_UPDATE = 'Unable to update a todo',
  EMPTY_TITLE = 'Title should not be empty',
}

export type Action =
  | { type: ActionType.ADD, payload: Item }
  | { type: ActionType.REMOVE, payload: number }
  | { type: ActionType.UPDATE, payload: Item }
  | { type: ActionType.UPDATE_TEMP, payload: Item | null }
  | { type: ActionType.FILTER, payload: FilterType }
  | { type: ActionType.LOAD, payload: Item[] }
  | { type: ActionType.ERROR, payload: string }
  | { type: ActionType.PROCESSED, payload: number[] };
