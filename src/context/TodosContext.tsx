/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import * as api from '../api/todos';
import { Context, ContextUpdate } from '../types/Context';
import { Status } from '../types/Status';
import { USER_ID } from '../constants/USER_ID';
import { Errors } from '../types/Errors';

export const TodosContext = React.createContext<Context>({
  todos: [],
  setTodos: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  filterTodos: Status.all,
  setFilterTodos: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  loadingIds: [],
  setLoadingIds: () => { },
});

export const TodoUpdateContext = React.createContext<ContextUpdate>({
  addTodo: () => { },
  deleteTodo: () => { },
  toggleTodo: () => { },
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterTodos, setFilterTodos] = useState<Status>(Status.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  function loadTodos() {
    api.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.Load);
      });
  }

  useEffect(loadTodos, []);

  function addTodo(todo: Omit<Todo, 'id'>) {
    return api.createTodo(todo)
      .then((newTodo) => setTodos((prev) => [...prev, newTodo] as Todo[]));
  }

  function deleteTodo(todoId: number) {
    setLoadingIds((prev) => [...prev, todoId]);

    return api.deleteTodo(todoId)
      .then(() => {
        setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(Errors.Delete);
      })
      .finally(() => {
        setLoadingIds((prev) => prev
          .filter((loadingId) => loadingId !== todoId));
      });
  }

  function toggleTodo(updatedTodo: Todo) {
    const { id } = updatedTodo;

    setLoadingIds((prev) => [...prev, id]);

    return api.editTodo(updatedTodo)
      .then(() => {
        setTodos((prevTodos) => {
          const updatedTodos = prevTodos.map((todo) => (todo.id === id
            ? { ...todo, completed: !todo.completed }
            : todo));

          return updatedTodos;
        });
      })
      .catch(() => {
        setErrorMessage(Errors.Update);
      })
      .finally(() => {
        setLoadingIds((prev) => prev
          .filter((loadingId) => loadingId !== id));
      });
  }

  const methods = useMemo(() => ({
    addTodo,
    deleteTodo,
    toggleTodo,
  }), []);

  const values = useMemo(() => ({
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    filterTodos,
    setFilterTodos,
    tempTodo,
    setTempTodo,
    loadingIds,
    setLoadingIds,
  }), [
    todos,
    errorMessage,
    filterTodos,
    tempTodo,
    loadingIds,
  ]);

  return (
    <TodoUpdateContext.Provider value={methods}>
      <TodosContext.Provider value={values}>
        {children}
      </TodosContext.Provider>
    </TodoUpdateContext.Provider>
  );
};
