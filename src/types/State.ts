import { Filter } from './Filter';
import { Todo } from './Todo';
import { TodoWithLoader } from './TodoWithLoader';

export type State = {
  todos: TodoWithLoader[];
  selectedTodo: null | Todo;
  tempTodo: null | Todo;
  filter: Filter;
  updatedAt: Date;
  errorMessage: string;
  loading: boolean;
};
