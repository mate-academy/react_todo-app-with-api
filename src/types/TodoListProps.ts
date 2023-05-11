import { Todo } from './Todo';
import { GetId, GetTodo, GetTodoAndTitle } from './functions';

export interface TodosProps {
  todos: Todo[];
  tempId?: number;
  tempIds: number[];
  tempTodo: Todo | null;
  deletingTodoIDs: number[];

  setTempId?: GetId;
  removeTodo?: GetId;
  renameTodo?: GetId;
  completeTodo?: GetTodo;
  updateTitle?: GetTodoAndTitle;
}
