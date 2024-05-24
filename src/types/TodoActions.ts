import { Filter } from './Filter';
import { Todo } from './Todo';

export interface TodoActions {
  addNewTodoLocally: (todo: Todo) => void;
  updateTodoLocally: (todo: Todo) => void;
  deleteTodoLocally: (todoId: number) => void;
  disableTodo: (value: boolean, targetId: number) => void;
  updateErrorStatus: (errorType: string) => void;
  setInputDisabled: (value: boolean) => void;
  createTempTodo: (
    data: {
      id: number;
      title: string;
      completed: boolean;
      userId: number;
    } | null,
  ) => void;
  setFilter: (filter: Filter) => void;
  setTargetTodo: (todoId: number) => void;
}
