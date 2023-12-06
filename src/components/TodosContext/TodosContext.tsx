import React, {
  createContext, useCallback, useEffect, useMemo, useState,
} from 'react';

import * as todoService from '../../api/todos';
import { FilterTodos } from '../../types/FilterTodos';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

const USER_ID = 11986;

type DefaultCotextValue = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo) => void,
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>,
  deleteTodo: (todoId: number) => void,
  updateTodo: (todo: Todo) => void,
  isSubmiting: boolean,
  setIsSubmiting: (value: boolean) => void,
  filterTodos: FilterTodos,
  setFilterTodos: (filter: FilterTodos) => void,
  visibleTodos: Todo[],
  errorMessage: Error,
  setErrorMessage: (err: Error) => void,
  USER_ID: number,
};

export const TodosContext = createContext<DefaultCotextValue>({
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  addTodo: async () => {},
  deleteTodo: async () => {},
  updateTodo: async () => {},
  isSubmiting: false,
  setIsSubmiting: () => {},
  filterTodos: FilterTodos.All,
  setFilterTodos: () => {},
  visibleTodos: [],
  errorMessage: Error.Default,
  setErrorMessage: () => {},
  USER_ID,
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterTodos, setFilterTodos] = useState<FilterTodos>(FilterTodos.All);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Error>(Error.Default);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.CantLoad));
  }, []);

  const addTodo = useCallback(
    ({ title, userId, completed }: Omit<Todo, 'id'>) => {
      setErrorMessage(Error.Default);

      setTempTodo({
        title, userId, completed, id: 0,
      });

      setIsSubmiting(true);

      return todoService.createTodo({ userId, title, completed })
        .then(newTodo => {
          setTodos([...todos, newTodo]);
        })
        .catch((error) => {
          setErrorMessage(Error.Add);
          throw error;
        })
        .finally(() => {
          setTempTodo(null);
        });
    }, [todos],
  );

  const visibleTodos = useMemo(() => {
    switch (filterTodos) {
      case FilterTodos.Active:
        return todos.filter(todo => !todo.completed);

      case FilterTodos.Completed:
        return todos.filter(todo => todo.completed);

      case FilterTodos.All:
      default:
        return todos;
    }
  }, [filterTodos, todos]);

  const deleteTodo = useCallback((todoId: number) => {
    setErrorMessage(Error.Default);

    return todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch((error) => {
        setTodos(todos);
        setErrorMessage(Error.Delete);
        throw error;
      });
  }, [todos]);

  const updateTodo = useCallback((updatedTodo: Todo) => {
    setErrorMessage(Error.Default);

    return todoService.updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos
            .findIndex(prevTodo => prevTodo.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch((error) => {
        setErrorMessage(Error.Update);
        throw error;
      });
  }, []);

  const value = useMemo(() => ({
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    addTodo,
    deleteTodo,
    updateTodo,
    isSubmiting,
    setIsSubmiting,
    filterTodos,
    setFilterTodos,
    visibleTodos,
    errorMessage,
    setErrorMessage,
    USER_ID,
  }), [
    todos, setTodos, tempTodo, setTempTodo, addTodo, deleteTodo, updateTodo,
    isSubmiting, setIsSubmiting, filterTodos, visibleTodos,
    errorMessage, setErrorMessage,
  ]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
