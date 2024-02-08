import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from 'react';
import * as api from './api/todos';
import { Todo } from './types/Todo';

interface TodoContextProps {
  children: ReactNode;
}

export interface TodoContextValue {
  todos: Todo[];
  postTodo: string;
  filteredTodos: Todo[];
  filter: string;
  error: string;
  existingCompleted: boolean;
  nonCompletedTodos: number;
  disableInput: boolean
  isLoading: number[];
  titleField: React.MutableRefObject<HTMLInputElement>;
  tempTodo: Todo | null;
  isChosenToRename: number;
  editingTodo: string;
  handleEditing: number;
  setHandleEditing: (id: number) => void;
  setEditingTodo: (qury: string) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setError: (errorMessage: string) => void;
  setFilter: (newFilter: string) => void;
  handleSubmit: () => void;
  setPostTodo: (postTodo: string) => void;
  setFilteredTodos: (todos: Todo[]) => void;
  setDisableInput: (bollean: boolean) => void;
  handleDelete: (id: number) => void;
  handleCompletedDelete: () => void,
  makeTodoCompleted: (id: number, isCompleted: boolean) => void,
  setIsChosenToRename: (id: number) => void,
  makeTodoChange: (id: number, value: string) => void,
}

export const TodoContext = createContext<TodoContextValue>({
  todos: [],
  postTodo: '',
  filteredTodos: [],
  filter: '',
  error: '',
  existingCompleted: false,
  nonCompletedTodos: 0,
  disableInput: false,
  isLoading: [],
  tempTodo: null,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  titleField: null!,
  isChosenToRename: 0,
  editingTodo: '',
  handleEditing: 0,
  setEditingTodo: () => {},
  setIsLoading: () => {},
  setError: () => {},
  setFilter: () => {},
  handleSubmit: () => {},
  setPostTodo: () => {},
  setFilteredTodos: () => {},
  setDisableInput: () => {},
  handleDelete: () => {},
  handleCompletedDelete: () => {},
  makeTodoCompleted: () => {},
  setIsChosenToRename: () => {},
  makeTodoChange: () => {},
  setHandleEditing: () => {},
});

const USER_ID = 104;

export const TodoProvider: React.FC<TodoContextProps> = ({ children }) => {
  const [postTodo, setPostTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // const [doubleClickCounter, setDoubleClickCounter] = useState(0);
  const [isChosenToRename, setIsChosenToRename] = useState(0);
  const [editingTodo, setEditingTodo] = useState('');
  const [handleEditing, setHandleEditing] = useState(0);
  const [timeToFocus, setTimeToFocus] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const titleField = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (titleField?.current) {
      titleField.current.focus();
    }
  }, [timeToFocus]);

  const existingCompleted = todos.some((todo) => {
    return todo.completed;
  });

  const nonCompletedTodos = todos.reduce((counter, todo) => {
    if (!todo.completed) {
      return counter + 1;
    }

    return counter;
  }, 0);

  useEffect(() => {
    api.getTodos(USER_ID)
      .then((apiTodos) => {
        setTodos(apiTodos);
        setFilteredTodos(apiTodos);
        setTimeToFocus(current => current + 1);
      })
      .catch(() => {
        setError('Unable to load todos');
        setTimeToFocus(current => current + 1);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  useEffect(() => {
    const filtereDtodo = () => {
      switch (filter) {
        case 'active':
          return todos.filter((todo) => {
            return todo.completed === false;
          });
        case 'completed':
          return todos.filter((todo) => {
            return todo.completed === true;
          });
        case 'all':
          return todos;
        default:
          return todos;
      }
    };

    setFilteredTodos(filtereDtodo());
  }, [filter, todos]);

  const handleSubmit = () => {
    if (!postTodo.trim()) {
      setDisableInput(false);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: postTodo.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    api.postTodos(newTodo)
      .then((todo) => {
        setTempTodo(null);
        setTodos((currentTodos) => [...currentTodos, todo]);
        setPostTodo('');
        setTimeToFocus(current => current + 1);
      })
      .catch(() => {
        setTempTodo(null);
        setError('Unable to add a todo');
        setTimeToFocus(current => current + 1);
      })
      .finally(() => {
        titleField.current?.focus();
        setDisableInput(false);
      });
  };

  const handleDelete = (id: number) => {
    setIsLoading((currentLoading) => [...currentLoading, id]);

    api.deletTodos(id)
      .then(() => {
        setTodos((currentTodos) => currentTodos.filter(
          (todo) => todo.id !== id,
        ));
        setTimeToFocus(current => current + 1);
      })
      .catch(() => {
        setError('Unable to delete a todo');
        if (titleField.current) {
          titleField.current.focus();
        }

        setTimeToFocus(current => current + 1);
      })
      .finally(() => {
        setIsLoading((currentLoading) => {
          return currentLoading.filter((loadingId) => loadingId !== id);
        });
        setHandleEditing(0);
      });
  };

  const makeTodoChange = (id: number, value: string) => {
    const changedTodo: Pick<Todo, 'title' | 'userId'>
      = { title: value, userId: USER_ID };

    setIsLoading((currentLoading) => [...currentLoading, id]);
    api.patchTodos(id, changedTodo)
      .then(() => {
        setTodos((currentTodos) => currentTodos.map(todo => {
          return todo.id === id ? { ...todo, title: value } : todo;
        }));
        setIsLoading((currentLoading) => {
          return currentLoading.filter((loadingId) => loadingId !== id);
        });
        setIsChosenToRename(0);
        setTimeout(() => setHandleEditing(0), 10);
      })
      .catch(() => {
        setError('Unable to update a todo');
        setIsLoading((currentLoading) => {
          return currentLoading.filter((loadingId) => loadingId !== id);
        });
      });
  };

  const makeTodoCompleted = (id: number, isCompleted: boolean) => {
    const completedTodo: Pick<Todo, 'completed' | 'userId'>
      = { completed: !isCompleted, userId: USER_ID };

    setIsLoading((currentLoading) => [...currentLoading, id]);

    api.patchTodos(id, completedTodo)
      .then(() => {
        setTodos((currentTodos) => currentTodos.map(todo => {
          return todo.id === id ? {
            ...todo, completed: !isCompleted,
          } : todo;
        }));
        setIsLoading((currentLoading) => {
          return currentLoading.filter((loadingId) => loadingId !== id);
        });
      })
      .catch(() => {
        setError('Unable to update a todo');
        setIsLoading((currentLoading) => {
          return currentLoading.filter((loadingId) => loadingId !== id);
        });
        if (titleField.current) {
          titleField.current.focus();
        }
      });
  };

  const handleCompletedDelete = () => {
    const completedTodoIds = todos.filter((todo) => todo.completed)
      .map((todo) => todo.id);

    completedTodoIds.forEach((id) => {
      handleDelete(id);
    });
  };

  const value = {
    postTodo,
    todos,
    filteredTodos,
    filter,
    error,
    existingCompleted,
    nonCompletedTodos,
    disableInput,
    isLoading,
    titleField,
    tempTodo,
    isChosenToRename,
    editingTodo,
    handleEditing,
    setHandleEditing,
    setIsLoading,
    setFilter,
    handleSubmit,
    setError,
    setPostTodo,
    setFilteredTodos,
    setDisableInput,
    handleDelete,
    handleCompletedDelete,
    makeTodoCompleted,
    setIsChosenToRename,
    setEditingTodo,
    makeTodoChange,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
