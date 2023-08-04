import { FormEvent } from 'react';
import { Todo } from './Todo';

export interface AppContextType {
  todos: Todo[],
  todoTitle: string,
  onTodoTitleChange: (val: string) => void,
  filterType: string,
  setFilterType: (val: string) => void,
  errorType: string,
  setErrorType: (val: string) => void,
  processing: number[],
  setProcessing: React.Dispatch<React.SetStateAction<number[]>>,
  tempTodo: Todo | null,
  // new methods and functions for updating state
  downloadTodos: () => Promise<void>,
  deleteTodo: (val: number) => Promise<void>,
  updateTodo: ({ ...args }: Partial<Todo>) => Promise<void>,
  createTodo: ({ ...args }: Partial<Todo>) => Promise<void>,
  handleToggleAllTodos: () => void,
  handleHeaderFormSubmit: (event: FormEvent) => void,
  handleClearCompleted: () => void,
}
