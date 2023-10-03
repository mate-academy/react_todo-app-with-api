import { createContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos, patchTodo } from '../api/todos';

type TodoContextType = {
  USER_ID: number
  todos: Todo[]
  setTodos: (todos: Todo[]) => void
  tempTodo: Todo | null
  setTempTodo: (data: Todo | null) => void
  errorMessage: string
  setErrorMessage: (message: string) => void
  loadingItems: number[]
  setLoadingItems: (id: (prevState: number[]) => number[]) => void
  addTodo: (todo: Todo) => void
  updateTodos: (todo: Todo) => void
  removeTodo: (id: number) => void
  handlePatch: (todo: Todo, data: Todo) => Promise<void>
  handleDelete: (id: number) => Promise<void>
  isVisibleErrorMessage: boolean
  setIsVisibleErrorMessage: (isVisible: boolean) => void
};

export const TodoContext = createContext<TodoContextType>({
  USER_ID: 11564,
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  loadingItems: [],
  setLoadingItems: () => {},
  addTodo: () => {},
  updateTodos: () => {},
  removeTodo: () => {},
  handlePatch: () => new Promise(() => {}),
  handleDelete: () => new Promise(() => {}),
  isVisibleErrorMessage: false,
  setIsVisibleErrorMessage: () => {},
});

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [
    isVisibleErrorMessage,
    setIsVisibleErrorMessage,
  ] = useState<boolean>(false);
  const [loadingItems, setLoadingItems] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const USER_ID = 11564;

  const addTodo = (todo: Todo) => {
    setTodos((pervState) => [...pervState, todo]);
  };

  const updateTodos = (todo: Todo) => {
    setTodos((prevState) => prevState
      .map((current) => (current.id === todo.id ? todo : current)));
  };

  const removeTodo = (id: number) => {
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const handlePatch = (todo: Todo, data: Todo): Promise<void> => {
    setLoadingItems((prevState) => [...prevState, todo.id]);

    return patchTodo(todo.id, data)
      .then(() => {
        updateTodos(data);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setIsVisibleErrorMessage(true);
      })
      .finally(() => {
        setLoadingItems((prevState) => prevState
          .filter((stateId) => todo.id !== stateId));
      });
  };

  const handleDelete = (id: number) => {
    setLoadingItems((prevState) => [...prevState, id]);

    return deleteTodo(id)
      .then(() => {
        removeTodo(id);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setIsVisibleErrorMessage(true);
      })
      .finally(() => setLoadingItems((prevState) => prevState
        .filter((stateId) => id !== stateId)));
  };

  useEffect(() => {
    setErrorMessage('');
    getTodos(USER_ID)
      .then((data) => setTodos(data))
      .then(() => setTempTodo(null))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setIsVisibleErrorMessage(true);
      });
  }, []);

  return (
    <TodoContext.Provider value={{
      USER_ID,
      todos,
      setTodos,
      tempTodo,
      setTempTodo,
      errorMessage,
      setErrorMessage,
      loadingItems,
      setLoadingItems,
      addTodo,
      updateTodos,
      removeTodo,
      handlePatch,
      handleDelete,
      isVisibleErrorMessage,
      setIsVisibleErrorMessage,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
};
