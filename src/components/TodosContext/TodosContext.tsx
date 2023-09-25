import React, {
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../../api/todos';

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

export const TodosContext = React.createContext<Context>({
  todos: [],
  setTodos: () => { },
  visibleTodos: [],
  isLoading: {},
  setLoading: () => { },
  setFilterType: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  addTodo: () => Promise.resolve({} as Todo),
  updateAllCheckbox: () => { },
  hangleDeleteTodo: () => { },
  updateInputCheckbox: () => { },
  deleteComplitedTodos: () => { },
});

interface Props {
  children: ReactNode;
}

export const USER_ID = 11537;

export enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [filterType, setFilterType] = useState(FilterType.All);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const timerErrorMessage = useRef<number>(0);
  const completedTodos = todos.filter(({ completed }) => completed);
  const incompleteTodos = todos.some(todo => !todo.completed)
    ? todos.filter(({ completed }) => !completed)
    : todos;

  useEffect(() => {
    if (timerErrorMessage.current) {
      window.clearTimeout(timerErrorMessage.current);
    }

    timerErrorMessage.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
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
        setErrorMessage('Unable to add a todo');
        throw new Error();
      });
  };

  const updateAllCheckbox = () => {
    incompleteTodos.forEach(todo => {
      setLoading(todo.id, true);

      updateTodo({
        id: todo.id,
        title: todo.title,
        userId: USER_ID,
        completed: !todo.completed,
      })
        .then(updtTodo => {
          setTodos((prevTodos) => prevTodos.map(currentTodo => (
            currentTodo.id !== updtTodo.id
              ? currentTodo
              : updtTodo
          )));
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo ');
        })
        .finally(() => {
          setLoading(todo.id, false);
        });
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
      setTodos((prevTodos) => prevTodos.filter(item => item.id !== userId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }
  };

  const deleteComplitedTodos = async () => {
    try {
      const deletedTodos: number[] = [];

      completedTodos.forEach(({ id }) => {
        setLoading(id, true);
      });

      await Promise.all(
        todos.map(async ({ id, completed }) => {
          if (completed) {
            try {
              await deleteTodo(id);
              deletedTodos.push(id);
            } catch (error) {
              setErrorMessage('Unable to delete a todo');
            }
          }
        }),
      );

      setTodos((prevState) => (
        prevState.filter(({ id }) => !deletedTodos.includes(id))
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
