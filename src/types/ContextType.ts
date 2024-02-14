import { Todo } from './Todo';

export interface TodoContextValue {
  todos: Todo[];
  postTodo: string;
  filteredTodos: Todo[];
  filter: string;
  error: string;
  existingCompleted: boolean;
  nonCompletedTodos: number;
  disableInput: boolean
  loadingTodos: number[];
  titleField: React.RefObject<HTMLInputElement>;
  tempTodo: Todo | null;
  isChosenToRename: number;
  editingTodo: string;
  handleEditing: number;
  setHandleEditing: (id: number) => void;
  setEditingTodo: (qury: string) => void;
  setLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>;
  setError: (errorMessage: string) => void;
  setFilter: (newFilter: string) => void;
  handleSubmit: () => void;
  setPostTodo: (postTodo: string) => void;
  setFilteredTodos: (todos: Todo[]) => void;
  setDisableInput: (bollean: boolean) => void;
  handleDelete: (id: number) => void;
  handleCompletedDelete: () => void,
  makeTodoCompleted: (id: number, isCompleted: boolean) => void,
  setIsChosenToRename: (id: number) => void,
  makeTodoChange: (id: number, value: string) => void,
}
