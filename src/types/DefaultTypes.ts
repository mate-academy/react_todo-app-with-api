import { Error } from './Error';
import { TodoStatus } from './TodoStatus';
import { Todo } from './Todo';

export interface DefaultTypes {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  setTempTodo: (value: Todo | null) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  error: Error,
  setError: (value: Error) => void,
  isClearCompleted: boolean,
  setIsClearCompleted: (value: boolean) => void,
  isUpdating: boolean,
  setIsUpdating: (value: boolean) => void,
  toggledTodos: number | null,
  setToggledTodos: (value: number | null) => void,
  isToggleAllClicked: boolean,
  setIsToggleAllClicked: (value: boolean) => void,
  isEveryTodoCompleted: boolean,
  selectedType: TodoStatus,
  setSelectedType: (value: TodoStatus) => void,
}
