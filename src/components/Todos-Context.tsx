import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { USER_ID, deleteTodos, getTodos, updateTodo } from '../api/todos';
import { UserWarning } from '../UserWarning';
import { Status, filterTodo } from '../utils/TodosFilter';

type TodosContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setQuery: Dispatch<SetStateAction<string>>;
  query: string;
  newTodo: Todo[];
  setFiltred: Dispatch<SetStateAction<Status>>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  loading: boolean;
  handleCompleted: (id: number) => void;
  filtred: Status;
  handleErrorMessage: () => void;
  todoDeleteButton: (userId: number, todoId: number) => void;
  handleCompleteAll: () => void;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  titleField: RefObject<HTMLInputElement> | null;
  deletingTodos: number[];
  setDeletingTodos: Dispatch<SetStateAction<number[]>>;
};

const initialTodosContextValue: TodosContextType = {
  todos: [],
  setTodos: () => {},
  setQuery: () => [],
  query: '',
  newTodo: [],
  setFiltred: () => {},
  errorMessage: '',
  setErrorMessage: () => '',
  loading: false,
  handleCompleted: () => {},
  filtred: Status.All,
  handleErrorMessage: () => {},
  todoDeleteButton: () => {},
  handleCompleteAll: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  setLoading: () => {},
  titleField: null,
  deletingTodos: [],
  setDeletingTodos: () => {},
};

export const TodosContext = React.createContext<TodosContextType>(
  initialTodosContextValue,
);

type PropsContext = {
  children: React.ReactNode;
};

export const TodoContextProvider: React.FC<PropsContext> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filtred, setFiltred] = useState<Status>(Status.All);
  const [loading, setLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodos, setDeletingTodos] = useState<number[]>([]);
  const titleField = useRef<HTMLInputElement>(null);

  const newTodo: Todo[] = filterTodo(todos, filtred);

  function getAllTodos() {
    setLoading(true);
    getTodos()
      .then(receivedTodos => {
        setTodos(receivedTodos);
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setLoading(false);
      });
  }

  const todoDeleteButton = (userId: number, todoId: number) => {
    setDeletingTodos([...deletingTodos, todoId]);
    deleteTodos(userId, todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodos(deletingTodos.filter(id => id !== todoId));
      });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  useEffect(() => {
    if (USER_ID) {
      getAllTodos();
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleCompleted = (id: number) => {
    const todo = newTodo.find(t => t.id === id);

    if (!todo) {
      return;
    }

    const todoCopy = { ...todo };

    setDeletingTodos([id]);

    todoCopy.completed = !todoCopy.completed;

    updateTodo(todoCopy)
      .then(t => {
        setTodos(prevTodos => {
          return prevTodos.map(prevTodo => {
            if (prevTodo.id === t.id) {
              return t;
            }

            return prevTodo;
          });
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        setDeletingTodos(prevIds => prevIds.filter(prevIds => prevIds !== id));
      });
  };

  const handleCompleteAll = () => {
    const hasIncomplete = todos.some(todo => !todo.completed);
    const newStateTodos = todos.map(todo => ({
      ...todo,
      completed: !!hasIncomplete,
    }));

    Promise.all(
      newStateTodos.map(todo => {
        return updateTodo({
          id: todo.id,
          title: todo.title,
          completed: todo.completed,
        });
      }),
    )
      .then(updatedTodos => {
        setTodos(prevTodos => {
          return prevTodos.map(prevTodo => {
            const updatedTodo = updatedTodos.find(t => t.id === prevTodo.id);

            return updatedTodo ? updatedTodo : prevTodo;
          });
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      });

    setTodos(newStateTodos);
  };

  const handleErrorMessage = () => {
    setErrorMessage('');
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        query,
        setQuery,
        newTodo,
        setFiltred,
        errorMessage,
        setErrorMessage,
        loading,
        handleCompleted,
        filtred,
        handleErrorMessage,
        todoDeleteButton,
        handleCompleteAll,
        tempTodo,
        setTempTodo,
        setLoading,
        titleField,
        deletingTodos,
        setDeletingTodos,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
