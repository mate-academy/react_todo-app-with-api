import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../../api/todos';
import { FilterType } from '../../types/EnumFilterType';

export const USER_ID = 11537;

interface Context {
  todos: Todo[],
  visibleTodos: Todo[],
  isLoading: { [key: number]: boolean },
  setLoading: (key: number, value: boolean) => void,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setFilterType: (value: FilterType) => void,
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo | null) => void,
  errorMessage: string,
  setErrorMessage: (value: string) => void,
  addTodo: (value: string) => Promise<Todo>
  updateAllCheckbox: () => void,
  hangleDeleteTodo: (todoId: number) => void,
  updateInputCheckbox: (todo: Todo) => void,
  deleteComplitedTodos: () => void,
}

export const TodosContext = React.createContext({} as Context);

interface Props {
  children: ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [filterType, setFilterType] = useState(FilterType.All);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const incompleteTodos = todos.some(({ completed }) => completed)
    ? todos.filter(({ completed }) => !completed)
    : todos;

  useEffect(() => {
    const timerErrorMessage = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerErrorMessage);
  }, [errorMessage]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((response) => {
        setTodos(response);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const setLoading = (key: number, value: boolean) => {
    setIsLoading((prevLoadingKeys) => ({
      ...prevLoadingKeys,
      [key]: value,
    }));
  };

  const addTodo = (prerapedTitle: string): Promise<Todo> => {
    return createTodo({
      title: prerapedTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(newPost => {
        setTodos((prevTodos) => [...prevTodos, newPost]);

        return newPost;
      })
      .catch(() => {
        throw new Error('Unable to add a todo');
      });
  };

  const updateAllCheckbox = () => {
    const updatePromises = incompleteTodos.map(todo => {
      setLoading(todo.id, true);

      return updateTodo({
        id: todo.id,
        title: todo.title,
        userId: USER_ID,
        completed: !todo.completed,
      })
        .then(updtTodo => {
          return updtTodo;
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo ');
        })
        .finally(() => {
          setLoading(todo.id, false);
        });
    });

    Promise.all(updatePromises)
      .then(updatedTodos => {
        setTodos((prevTodos) => prevTodos.map(todo => (
          updatedTodos.find(upgradeTodo => upgradeTodo?.id === todo.id) || todo
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo ');
      });
  };

  const updateInputCheckbox = (todo: Todo) => {
    setLoading(todo.id, true);

    updateTodo({
      id: todo.id,
      title: todo.title,
      userId: USER_ID,
      completed: !todo.completed,
    })
      .then(updatetTodo => {
        setTodos((prevTodos) => prevTodos.map(currentTodo => (
          currentTodo.id !== updatetTodo.id
            ? currentTodo
            : updatetTodo
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => setLoading(todo.id, false));
  };

  const hangleDeleteTodo = async (userId: number) => {
    try {
      setLoading(userId, true);
      await deleteTodo(userId);
      setTodos((prevTodos) => prevTodos.filter(({ id }) => id !== userId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const deleteComplitedTodos = async () => {
    try {
      const deleteRequests = todos.reduce(
        (requests: Promise<unknown>[], { id, completed }) => {
          if (completed) {
            setLoading(id, true);

            requests.push(deleteTodo(id));
          }

          return requests;
        }, [],
      );

      await Promise.all(deleteRequests);

      setTodos((prevState) => (
        prevState.filter(({ completed }) => !completed)
      ));
    } catch {
      setErrorMessage('Unable to delete todos');
    }
  };

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.Active:
        return todos.filter(({ completed }) => !completed);

      case FilterType.Completed:
        return todos.filter(({ completed }) => completed);

      default:
        return todos;
    }
  }, [filterType, todos]);

  const intialValue = {
    todos,
    visibleTodos,
    isLoading,
    tempTodo,
    errorMessage,
    setLoading,
    setFilterType,
    setTodos,
    setTempTodo,
    setErrorMessage,
    addTodo,
    updateAllCheckbox,
    hangleDeleteTodo,
    updateInputCheckbox,
    deleteComplitedTodos,
  };

  return (
    <TodosContext.Provider
      value={intialValue}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodosContext = () => {
  return useContext(TodosContext);
};
