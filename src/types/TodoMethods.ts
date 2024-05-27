import { FilterField } from './FilterField';
import { Todo } from './Todo';

export interface TodoMethods {
  setTodosLocal: (todos: Todo[]) => void;
  addTodoLocal: (todo: Todo) => void;
  deleteTodoLocal: (todoId: number) => void;
  modifyTodoLocal: (todoId: number, todoProps: Partial<Todo>) => void;
  setFilterField: (filterField: FilterField) => void;
  setTimeoutErrorMessage: (message: string, delay?: number) => void;
}
