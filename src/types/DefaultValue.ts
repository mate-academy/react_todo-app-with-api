import { ErrorMessage } from './ErrorMessage';
import { Status } from './Status';
import { Todo } from './Todo';

export interface DefaultValue {
  todos: Todo[];
  setTodos: (value: Todo[] | ((value: Todo[]) => Todo[])) => void;
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  setTempTodo: (value: Todo | null) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  error: ErrorMessage,
  setError: (value: ErrorMessage) => void,
  isClearCompleted: boolean,
  setIsClearCompleted: (value: boolean) => void,
  isUpdating: boolean,
  setIsUpdating: (value: boolean) => void,
  toggledTodos: number | null,
  setToggledTodos: (value: number | null) => void,
  isToggleAllClicked: boolean,
  setIsToggleAllClicked: (value: boolean) => void,
  isEveryTodoCompleted: boolean,
  selectedType: Status,
  setSelectedType: (value: Status) => void,
}
