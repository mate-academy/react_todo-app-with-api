import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from 'react';
import * as api from './api/todos';
import { Todo } from './types/Todo';
import { TodoContextValue } from './types/ContextType';

interface TodoContextProps {
  children: ReactNode;
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
  loadingTodos: [],
  tempTodo: null,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  titleField: null!,
  isChosenToRename: 0,
  editingTodo: '',
  handleEditing: 0,
  setEditingTodo: () => {},
  setLoadingTodos: () => {},
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
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isChosenToRename, setIsChosenToRename] = useState(0);
  const [editingTodo, setEditingTodo] = useState('');
  const [handleEditing, setHandleEditing] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [tempTodo, todos.length]);

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
      })
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    const filteredtodo = () => {
      switch (filter) {
        case 'active':
          return todos.filter((todo) => {
            return !todo.completed;
          });
        case 'completed':
          return todos.filter((todo) => {
            return todo.completed;
          });
        default:
          return todos;
      }
    };

    setFilteredTodos(filteredtodo());
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
      })
      .catch(() => {
        setTempTodo(null);
        setError('Unable to add a todo');
      })
      .finally(() => {
        titleField.current?.focus();
        setDisableInput(false);
      });
  };

  const handleDelete = (id: number) => {
    setLoadingTodos((currentLoading) => [...currentLoading, id]);

    api.deletTodos(id)
      .then(() => {
        setTodos((currentTodos) => currentTodos.filter(
          (todo) => todo.id !== id,
        ));
      })
      .catch(() => {
        setError('Unable to delete a todo');
        if (titleField.current) {
          titleField.current.focus();
        }
      })
      .finally(() => {
        setLoadingTodos((currentLoading) => {
          return currentLoading.filter((loadingId) => loadingId !== id);
        });
        setHandleEditing(0);
      });
  };

  const makeTodoChange = (id: number, value: string) => {
    const changedTodo: Pick<Todo, 'title' | 'userId'>
      = { title: value, userId: USER_ID };

    setLoadingTodos((currentLoading) => [...currentLoading, id]);
    api.patchTodos(id, changedTodo)
      .then(() => {
        setTodos((currentTodos) => currentTodos.map(todo => {
          return todo.id === id ? { ...todo, title: value } : todo;
        }));
        setLoadingTodos((currentLoading) => {
          return currentLoading.filter((loadingId) => loadingId !== id);
        });
        setIsChosenToRename(0);
        setTimeout(() => setHandleEditing(0), 10);
      })
      .catch(() => {
        setError('Unable to update a todo');
        setLoadingTodos((currentLoading) => {
          return currentLoading.filter((loadingId) => loadingId !== id);
        });
      });
  };

  const makeTodoCompleted = (id: number, isCompleted: boolean) => {
    const completedTodo: Pick<Todo, 'completed' | 'userId'>
      = { completed: !isCompleted, userId: USER_ID };

    setLoadingTodos((currentLoading) => [...currentLoading, id]);

    api.patchTodos(id, completedTodo)
      .then(() => {
        setTodos((currentTodos) => currentTodos.map(todo => {
          return todo.id === id ? {
            ...todo, completed: !isCompleted,
          } : todo;
        }));
        setLoadingTodos((currentLoading) => {
          return currentLoading.filter((loadingId) => loadingId !== id);
        });
      })
      .catch(() => {
        setError('Unable to update a todo');
        setLoadingTodos((currentLoading) => {
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
    loadingTodos,
    titleField,
    tempTodo,
    isChosenToRename,
    editingTodo,
    handleEditing,
    setHandleEditing,
    setLoadingTodos,
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
