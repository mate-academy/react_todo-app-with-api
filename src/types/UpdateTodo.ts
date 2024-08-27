import { Dispatch, SetStateAction } from 'react';
import { Todo } from './Todo';
import { ErrorMessages } from '../enum/ErrorMessages';

export interface UpdateTodo {
  newData: string | boolean;
  setTodoLoading: (id: number, status: boolean) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setErrorMessage: (message: ErrorMessages) => void;
  id: number;
  onSave?: () => void;
  keyValue: string;
}
