import { Status } from './Status';
import { Todo } from './Todo';

export type TodosContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  addTodo: (title: string) => void;
  toggleTodo: (id: number, todo: Todo) => void;
  toggleAll: () => void;
  clearCompleted: () => void;
  updateTodoTitle: (id: number, newTitleTodo: Todo) => void;
  selectedStatus: Status;
  setSelectedStatus: React.Dispatch<React.SetStateAction<Status>>
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  removeError: (time?: number) => void,
  notCompletedTodos: Todo[],
  tempTodo: Todo | null,
  isSubmiting: boolean,
  setIsSubmiting: React.Dispatch<React.SetStateAction<boolean>>,
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  completedTodosIds: Array<number>,
  deletingIds: Array<number>,
  setDeletingIds: React.Dispatch<React.SetStateAction<number[]>>,
  deleteTodo: (todoId: number) => void,
  editingIds: Array<number>,
  areAllTodosCompleted: boolean,
};
