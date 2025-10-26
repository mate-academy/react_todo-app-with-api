import { Todo } from './Todo';

export type ActionFailur = { error: true; todo: Todo };

export type DeletionSucces = void;
export type DeletionResult = DeletionSucces | ActionFailur;

export type UpdatingSucces = Todo;
export type UpdatingResult = UpdatingSucces | ActionFailur;
