import { Todo } from './Todo';
import {
  HandleCompletedChange,
  HandleErrorMessageClear,
  HandleErrorMessageSend,
  HandleTitleChange,
  HandleTodoAdd,
  HandleTodoRemove,
} from './handlers';
import { TempTodo } from './types';

export type TodosContextValue = {
  todos: Todo[];
  tempTodo: TempTodo;
};

export type ErrorMessageContextValue = {
  errorMessage: string;
  sendError: boolean;
};

export type TodoApiContextValue = {
  handleCompletedChange: HandleCompletedChange;
  handleTitleChange: HandleTitleChange;
  handleTodoAdd: HandleTodoAdd;
  handleTodoRemove: HandleTodoRemove;
};

export type ErrorNotificationApiContextValue = {
  handleErrorMessageSend: HandleErrorMessageSend;
  handleErrorMessageClear: HandleErrorMessageClear;
};
