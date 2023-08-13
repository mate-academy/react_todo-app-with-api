import { createContext } from 'react';
import { Todo } from '../../types/Todo';

export interface TodoContextProps {
  todos: Todo[],
  size: number,
  countCompleted: number,
  setTodos: (todos: Todo[]) => void,
  addTodo: (todo: Todo) => void,
  removeTodos: (id: number[]) => void,
  updateTodos: (updatedTodos: Todo []) => void,
  handlingTodoIds: number[],
  setHandlingTodoIds: (ids: number[]) => void,
}

export const TodoContext = createContext<TodoContextProps>({
  todos: [],
  size: 0,
  countCompleted: 0,
  setTodos: () => {},
  addTodo: () => { /* empty */ },
  removeTodos: () => {},
  updateTodos: () => {},
  handlingTodoIds: [],
  setHandlingTodoIds: () => {},
});
