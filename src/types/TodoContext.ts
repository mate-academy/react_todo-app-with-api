import { Todo } from './Todo';

export type TodosContextType = {
  todos: Todo[],
  error: string,
  resetError: () => void,
  addTodo: (title: string, id: number) => void,
  removeTodo: (todoId: number) => void,
  handleSetError: (errorType: string) => void,
  disabledInput: boolean,
  tempTodo: Todo | null,
  toggleTodo: (id: number) => void,
  deleteCompletedTodos: () => void,
  updateTodoTitle: (id: number, title: string) => void,
  toggleAllTodos: () => void,
  showLoaderFor: number[],
};
