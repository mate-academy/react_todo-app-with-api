import { TodoType } from './TodoType';

export type TodoListContextType = {
  todos: TodoType[];
  errorMessage: string | null;
  tempTodo: TodoType | null;
  currentFilter: string;
  isDisabled: boolean;
  setCurrentFilter: (status: string) => void;
  addTodo: (todo: string) => void;
  deleteTodo: (id: number) => void;
  clearErrorMessage: () => void;
  clearCompletedTodo: () => void;
  updateTodo: (id: number, todo: Partial<TodoType>) => void;
  updateIsCompletedTodo: () => void;
};
