import { Status } from './Status';
import { Todo } from './Todo';

export interface TodosProps {
  todos: Todo[],
  status: Status,
  lids: Set<number>,
  tempTodo: Todo | null,
  errorMessage: string,

  setTodos: (val: Todo[]) => void,
  setLids: (val: Set<number>) => void,
  setStatus: (val: Status) => void,
  setTempTodo: (val: Todo | null) => void,
  setErrorMessage: (val: string) => void,

  active: number,
  isComplited: boolean,
  doDelete: (val: string) => void,
  doUpdate: (val: Todo) => void,
}
