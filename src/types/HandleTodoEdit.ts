import { Todo } from './Todo';

export type HandleTodoEdit = (
  oldTodo: Todo,
  newTitle: string,
  setIsBeingUpdated: (v: boolean) => void,
) => void;
