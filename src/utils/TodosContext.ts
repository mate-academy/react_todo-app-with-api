import { createContext } from 'react';
import { Todo } from '../types/Todo';

interface DefaultContext {
  todos: Todo[],
  setTodos: (value: Todo[] | ((value: Todo[]) => Todo[])) => void,
  processingTodos: number[],
  setProcessingTodos: (value: number[]) => void;
}

export const TodosContext = createContext<DefaultContext>({
  todos: [],
  setTodos: () => {},
  processingTodos: [],
  setProcessingTodos: () => {},
});
