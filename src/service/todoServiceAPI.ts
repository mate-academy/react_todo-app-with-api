import { Todo } from '../types/Todo';
import { getTodos, addTodo, deleteTodo, editTodo, USER_ID } from '../api/todos';

interface TodoService {
  getTodos: () => Promise<Todo[]>;
  addTodo: (todoTitle: string) => Promise<Todo>;
  deleteTodo: (todoId: number) => Promise<void>;
  editTitle: (todoId: number, todoTitle: string) => Promise<Todo>;
  toggleCompleteTodo: (todoId: number, isComplete: boolean) => Promise<Todo>;
}

export const TodoServiceAPI: TodoService = {
  getTodos: () => getTodos(),
  addTodo: (todoTitle: string) =>
    addTodo({
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    }),
  deleteTodo: (todoId: number) => deleteTodo(todoId),
  editTitle: (todoId: number, todoTitle: string) =>
    editTodo(todoId, {
      title: todoTitle,
    }),
  toggleCompleteTodo: (todoId: number, isComplete: boolean) =>
    editTodo(todoId, { completed: isComplete }),
};
