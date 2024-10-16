import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from '../api/todos';
import { Todo } from '../types/Todo';

export interface TodoService {
  getTodos: () => Promise<Todo[]>;
  addTodo: (todoTitle: string) => Promise<Todo>;
  deleteTodo: (todoId: number) => Promise<void>;
  updateTodo: (todoId: number, newData: Partial<Todo>) => Promise<Todo>;
}

export const TodoServiceApi: TodoService = {
  getTodos: () => getTodos(),
  addTodo: (todoTitle: string) =>
    addTodo({
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    }),
  deleteTodo: (todoId: number) => deleteTodo(todoId).then(() => {}),
  updateTodo: (todoId: number, newData: Partial<Todo>) =>
    updateTodo(todoId, newData),
};
