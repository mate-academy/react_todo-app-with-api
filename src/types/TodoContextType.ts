import { Todo } from './Todo';
import { Status } from './Status';
import { Errors } from './ErrorsTodo';

export interface TodoContextType {
  todos: Todo[];
  status: Status;
  errorMessage: Errors;
  draftTodo: Todo | null;
  isLoading: boolean;
  modifiedTodoId: number;
  setTodos: (todos: Todo[]) => void;
  setStatus: (status: Status) => void;
  setErrorMessage: (message: Errors) => void;
  setIsLoading: (loading: boolean) => void;
  setDraftTodo: (todo: Todo) => void;
  setModifiedTodoId: React.Dispatch<React.SetStateAction<number>>;
  addTodo: ({ title, completed, userId }: Todo) => Promise<void>;
  updateTodo: (updateTodo: Todo) => Promise<void>;
  deleteTodo: (todoId: number) => Promise<void>;
  handleCompleted: (currentTodo: Todo) => void;
  toggleAllCompleted: () => void;
}
