import { Errors } from './Errors';
import { Todo } from './Todo';
import { FilterBy } from './FilterBy';

export interface Props {
  todosCounter: number,
  filterBy: FilterBy,
  setFilterBy: (value: FilterBy) => void,
  todos: Todo[],
  setTodos:(value: Todo[]) => void,
  setLoadingId: (value: number[] | null) => void,
  setErrorMessage: (value: Errors) => void,
  onCompletedDelete: () => void
}
