import { Todo } from './Todo';
import { GetId, GetTodo, GetTodoAndTitle } from './functions';

export interface TodoProps {
  todo: Todo;
  tempId?: number;
  loading?: boolean;

  setTempId?: GetId;
  removeTodo?: GetId;
  renameTodo?: GetId;
  completeTodo?: GetTodo;
  updateTitle?: GetTodoAndTitle;
}
