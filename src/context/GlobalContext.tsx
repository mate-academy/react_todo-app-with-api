import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { patchTodo, postTodo, removeTodo } from '../api/todos';
import { ErrorEnum } from '../types/ErrorEnum';

type Props = {
  children: React.ReactNode;
};

interface GlobalContextType {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  addTodo: ({ title, completed, userId }: Omit<Todo, 'id'>) => void;
  deleteTodo(id: number): Promise<void>;
  errorMessage: ErrorEnum | null;
  setErrorAndClear: (error: ErrorEnum, delay: number) => void;
  isInputDisabled: boolean;
  setIsInputDisabled: (arg: boolean) => void;
  removeAllCompleted: () => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo) => void;
  toggleTodo: (todo: Todo) => void;
  isLoading: number[];
  areAllTodosCompleted: boolean;
  toggleAllTodos: () => void;
  setQuery: (string: string) => void;
  setSelectedTodo: (todo: Todo | null) => void;
  selectedTodo: Todo | null;
  query: string;
  changeTodoTitle: (todo: Todo) => void;
}

export const GlobalContext = React.createContext({} as GlobalContextType);

export const GlobalContextPropvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorEnum | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [query, setQuery] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const setErrorAndClear = (error: ErrorEnum, delay: number) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(null);
    }, delay);
  };

  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
    setIsInputDisabled(true);
    postTodo({ title, userId, completed })
      .then((res) => {
        setTodos((prevState) => [...prevState, res]);
      })
      .catch((err) => {
        setErrorMessage(ErrorEnum.ADD);
        throw new Error(err);
      })
      .finally(() => {
        setTempTodo(null);
        setIsInputDisabled(false);
      });
  }

  async function deleteTodo(id: number) {
    setIsLoading((ids) => [...ids, id]);
    try {
      await removeTodo(id);
      setTodos((prevState) => prevState.filter((item) => item.id !== id));
    } catch {
      setErrorMessage(ErrorEnum.DELETE);
    }
  }

  function removeAllCompleted() {
    const deletingIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    setIsLoading((prevIds) => [...prevIds, ...deletingIds]);

    const promises = deletingIds.map((id) => removeTodo(id));

    Promise.all(promises)
      .then(() => {
        setTodos((prevTodos) => {
          return prevTodos.filter((todo) => !deletingIds.includes(todo.id));
        });
        setIsLoading([]);
      })
      .catch((error) => {
        throw error;
      });
  }

  function toggleTodo({
    id, userId, completed, title,
  }: Todo) {
    setIsLoading((prev) => [...prev, id]);

    return patchTodo({
      id,
      userId,
      completed,
      title,
    })
      .then(() => {
        setTodos((prevState) => {
          return prevState.map((todo) => {
            if (todo.id === id) {
              return { ...todo, completed: !todo.completed };
            }

            return todo;
          });
        });
      })
      .catch(() => {
        setErrorAndClear(ErrorEnum.UPDATE, 3000);
      })
      .finally(() => {
        setIsLoading((prev) => {
          return prev.filter((ourId) => ourId !== id);
        });
      });
  }

  const areAllTodosCompleted = useMemo(() => {
    return todos.every((todo) => todo.completed === true);
  }, [todos]);

  const toggleAllTodosPromiseAllReq = (todosCompletedState: boolean) => {
    const preparedPromises = todos.map((todo) => {
      setIsLoading((prev) => [...prev, todo.id]);

      return patchTodo({ ...todo, completed: todosCompletedState });
    });

    Promise.all(preparedPromises)
      .then(() => {
        setTodos((prev) => {
          return prev.map((todo) => ({
            ...todo,
            completed: todosCompletedState,
          }));
        });
      })
      .catch(() => {
        setErrorAndClear(ErrorEnum.UPDATE, 3000);
      })
      .finally(() => setIsLoading([]));
  };

  const toggleAllTodos = useCallback(() => {
    if (areAllTodosCompleted) {
      toggleAllTodosPromiseAllReq(false);
    } else {
      toggleAllTodosPromiseAllReq(true);
    }
  }, [areAllTodosCompleted, todos]);

  const changeTodoTitle = (todo: Todo) => {
    if (query === todo.title.trim()) {
      setSelectedTodo(null);

      return;
    }

    if (query === '') {
      setSelectedTodo(null);
      deleteTodo(todo.id);

      return;
    }

    setIsLoading((prev) => [...prev, todo.id]);

    patchTodo({ ...todo, title: query })
      .then((res) => {
        setTodos((prevState) => {
          return prevState.map((currTodo) => {
            if (currTodo.id === todo.id) {
              return { ...todo, title: res.title };
            }

            return currTodo;
          });
        });
      })
      .catch(() => {
        setSelectedTodo(null);
        setIsLoading([]);
        setErrorAndClear(ErrorEnum.UPDATE, 3000);
      })
      .finally(() => {
        setIsLoading([]);
        setSelectedTodo(null);
      });
  };

  return (
    <GlobalContext.Provider
      value={{
        todos,
        setTodos,
        addTodo,
        deleteTodo,
        errorMessage,
        setErrorAndClear,
        isInputDisabled,
        setIsInputDisabled,
        removeAllCompleted,
        setTempTodo,
        tempTodo,
        toggleTodo,
        isLoading,
        areAllTodosCompleted,
        toggleAllTodos,
        setQuery,
        setSelectedTodo,
        selectedTodo,
        query,
        changeTodoTitle,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
