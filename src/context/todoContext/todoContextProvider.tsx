import {
  FC, ReactNode, memo, useMemo, useState,
} from 'react';
import { TodoContext, TodoContextProps } from './todoContext';
import { Todo } from '../../types/Todo';

interface Props {
  children: ReactNode,
}

export const TodoContextProvider: FC<Props> = memo(({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [handlingTodoIds, setHandlingTodoIds] = useState<number[]>([]);

  const addTodo = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  };

  const removeTodos = (ids: number[]) => {
    setTodos(prevTodos => prevTodos
      .filter(prevTodo => !ids.includes(prevTodo.id)));
  };

  const updateTodos = (updatedTodos: Todo[]) => {
    setTodos(prevTodos => prevTodos.map(prevTodo => {
      const updatedTodo = updatedTodos
        .find(todo => todo.id === prevTodo.id);

      if (updatedTodo) {
        return updatedTodo;
      }

      return prevTodo;
    }));
  };

  const size = useMemo(() => todos.length, [todos]);
  const countCompleted = useMemo(() => todos
    .filter(todo => todo.completed).length, [todos]);

  const value: TodoContextProps = useMemo(() => ({
    todos,
    size,
    countCompleted,
    setTodos,
    addTodo,
    removeTodos,
    updateTodos,
    handlingTodoIds,
    setHandlingTodoIds,
  }), [addTodo, todos]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
});
