import { createContext } from 'react';
import { Todo, TodoPreview } from '../../types/Todo';

export const TodosContext = createContext<{
  todos: Todo[],
  waitingForResponseTodosId: number[],
  addTodo:(todoTitle: string) => Promise<void>,
  updateTodos:(todosId: number[], data: TodoPreview) => Promise<void>
  removeTodos:(todosId: number[]) => Promise<void>,
}>({
      todos: [],
      waitingForResponseTodosId: [],
      addTodo: async () => {},
      updateTodos: async () => {},
      removeTodos: async () => {},
    });
