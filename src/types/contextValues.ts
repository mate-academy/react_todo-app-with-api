import { Todo } from './Todo';
import {
  HandleCompletedChange,
  HandleErrorMessageReceived,
  HandleTitleChange,
  HandleTodoAdd,
  HandleTodoRemove,
} from './handlers';
import { TempTodo } from './types';

export type TodosContextValue = {
  todos: Todo[];
  tempTodo: TempTodo;
};

export type ApiContextValue = {
  handleErrorMessageReceived: HandleErrorMessageReceived;
  handleCompletedChange: HandleCompletedChange;
  handleTitleChange: HandleTitleChange;
  handleTodoAdd: HandleTodoAdd;
  handleTodoRemove: HandleTodoRemove;
};
