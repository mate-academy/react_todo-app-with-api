export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum TodoFilter {
  All = '#/',
  Active = '#/active',
  Completed = '#/completed',
}

export enum ErrorType {
  LoadError = 'LOAD_ERROR',
  EmptyTitle = 'EMPTY_TITLE',
  AddTodoError = 'ADD_TODO_ERROR',
  DeleteTodoError = 'DELETE_TODO_ERROR',
  UpdateTodoError = 'UPDATE_TODO_ERROR',
}

export enum ErrorMessage {
  LoadError = 'Unable to load todos',
  EmptyTitle = 'Title should not be empty',
  AddTodoError = 'Unable to add a todo',
  DeleteTodoError = 'Unable to delete a todo',
  UpdateTodoError = 'Unable to update a todo',
  NothingError = '',
}

export type TodoContext = {
  todos: Todo[]
  setTodos: (v: Todo[] | ((n: Todo[]) => Todo[])) => void
  filterBy: TodoFilter
  setFilterBy: (filterBy: TodoFilter) => void
  errorMessage: ErrorMessage | string
  setErrorMessage: (errorMessage: ErrorMessage) => void
  tempTodo: Todo | null
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  loadingTodoIds: number[]
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>
};
