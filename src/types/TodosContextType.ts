import { Dispatch, SetStateAction } from 'react';
import { Todo } from './Todo';
import { SortType } from './SortType';

export interface TodosContextType {
  todos: Todo[] | null,
  setTodos: Dispatch<SetStateAction<Todo[] | null>>
  errorMessage: string,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  preparedTodos: Todo[] | null,
  sortQuery: string,
  setSortQuery: Dispatch<SetStateAction<SortType>>
  tempTodo: Todo | null,
  setTempTodo: Dispatch<SetStateAction<Todo | null>>,
  todosInProcess: number[],
  setTodosInProcess: Dispatch<SetStateAction<number[]>>,
  completedTodos: Todo[] | undefined
}
