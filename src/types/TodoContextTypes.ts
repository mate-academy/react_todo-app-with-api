import { ErrText } from './ErrText';
import { Status } from './Status';
import { Todo } from './Todo';

export interface TodoContextTypes {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
  errMessage: ErrText;
  setErrMessage: React.Dispatch<React.SetStateAction<ErrText>>;
  onDelete: (todoId: number) => Promise<void>;
  onAdd: ({ title, completed, userId }: Todo) => Promise<void>;
  onUpdate: (updatedTodo: Todo) => Promise<void>;
  toggleCompleted: (currentTodo: Todo) => void;
  toggleAllCompleted: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  modifiedTodoId: number;
  setModifiedTodoId: React.Dispatch<React.SetStateAction<number>>;
}
