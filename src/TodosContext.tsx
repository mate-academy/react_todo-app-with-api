import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import { Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { ErrorContext } from './ErrorContext';

const USER_ID = 11592;

export type State = {
  todos: Todo[],
  uncompletedTodosAmount: number,
  setTodos: (todos: Todo[]) => void,
  addNewTodo: (todo: Omit <Todo, 'id'>) => Promise<void>,
  isLoading: boolean,
  setIsLoading: (value: boolean) => void,
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo | null) => void,
  removeTodo: (id: number) => Promise<void>,
  loadingMap: { [key: number]: boolean } | {},
  toggleTodo: (todo: Todo, completedStatus?: boolean) => Promise<void>,
  editTodo: (editedTodo: Todo, newTitle: string) => Promise<void>,
};

export const TodosContext = React.createContext<State>({
  todos: [],
  uncompletedTodosAmount: 0,
  setTodos: () => {},
  addNewTodo: async () => {},
  isLoading: false,
  setIsLoading: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  removeTodo: async () => {},
  loadingMap: {},
  toggleTodo: async () => {},
  editTodo: async () => {},
});

interface Props {
  children: React.ReactNode,
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMap, setLoadingMap] = useState({});

  const { setError } = useContext(ErrorContext);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  const uncompletedTodosAmount = useMemo(() => todos
    .filter(todo => !todo.completed).length, [todos]);

  function addNewTodo(createdTodo: Omit <Todo, 'id'>) {
    return addTodo(createdTodo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((err) => {
        setError('Unable to add a todo');
        throw (err);
      })
      .finally(() => setTempTodo(null));
  }

  const removeTodo = (id: number) => {
    setIsLoading(true);
    setLoadingMap(prevMap => ({
      ...prevMap,
      [id]: true,
    }));

    return deleteTodo(id)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== id),
      ))
      .catch(() => {
        setError('Unable to delete a todo');
        setIsLoading(false);
        setLoadingMap({});
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingMap(prevMap => ({
          ...prevMap,
          [id]: false,
        }));
      });
  };

  const toggleTodo = (
    toggledTodo: Todo,
    completedStatus: boolean = toggledTodo.completed,
  ) => {
    setLoadingMap(prevMap => ({
      ...prevMap,
      [toggledTodo.id]: true,
    }));

    return updateTodo({
      ...toggledTodo,
      completed: !completedStatus,
    })
      .then(() => setTodos(currentTodos => currentTodos.map(
        todo => (todo.id === toggledTodo.id
          ? {
            ...todo,
            completed: !completedStatus,
          }
          : todo),
      )))
      .catch(() => {
        setError('Unable to update a todo');
        setLoadingMap({});
      })
      .finally(() => {
        setLoadingMap(prevMap => ({
          ...prevMap,
          [toggledTodo.id]: false,
        }));
      });
  };

  const editTodo = (editedTodo: Todo, newTitle: string) => {
    setLoadingMap(prevMap => ({
      ...prevMap,
      [editedTodo.id]: true,
    }));

    const updatedTodos = todos.map(
      todo => (todo.id === editedTodo.id
        ? {
          ...todo,
          title: newTitle,
        }
        : todo),
    );

    setTodos(updatedTodos);

    return updateTodo({
      ...editedTodo,
      title: newTitle,
    })
      .then(() => setTodos(currentTodos => currentTodos.map(
        todo => (todo.id === editedTodo.id
          ? {
            ...todo,
            title: newTitle,
          }
          : todo),
      )))
      .catch((err) => {
        setError('Unable to update a todo');
        setLoadingMap({});
        throw err;
      })
      .finally(() => {
        setLoadingMap(prevMap => ({
          ...prevMap,
          [editedTodo.id]: false,
        }));
      });
  };

  const value = useMemo(() => ({
    todos,
    uncompletedTodosAmount,
    setTodos,
    addNewTodo,
    isLoading,
    setIsLoading,
    tempTodo,
    setTempTodo,
    removeTodo,
    loadingMap,
    toggleTodo,
    editTodo,
  }), [todos, tempTodo, isLoading, loadingMap]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
