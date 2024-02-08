import { SetStateAction } from 'react';
import { Status } from './Status';
import { Todo } from './Todo';

export interface TodoContextProps {
  todos: Todo[];
  setTodos: React.Dispatch<SetStateAction<Todo[]>>,
  activeTodos: Todo[];
  completedTodos: Todo[];
  filter: Status;
  addTodo: (todo: Todo) => void;
  toggleCompleted: (id: number) => void;
  toggleAllCompleted: (completed: boolean) => void;
  deleteTodo: (id: number) => void;
  clearCompleted: () => void;
  setFilter: (filter: Status) => void;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  handlerDeleteCompleted: () => void;
  tempTodo: null | Todo;
  setTempTodo: React.Dispatch<React.SetStateAction<null | Todo>>;
  processingIds: number[];
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  updateTodoTitle: (newTitle: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
}
