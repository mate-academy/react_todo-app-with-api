import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';

import { UserWarning } from '../../../UserWarning';
import {
  createTodo, getTodos, deleteTodo, renameRequest,
} from '../../todos';
import { Todo } from '../../types/Todo';

type Props = {
  children: React.ReactNode;
};

const USER_ID = 12157;

export enum FilterStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

type ContextType = {
  todos: Todo[];
  setTodos: (React.Dispatch<React.SetStateAction<Todo[]>>);
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  isDisabled: boolean,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  filt: FilterStatus;
  setFilt: React.Dispatch<React.SetStateAction<FilterStatus>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>
  error: string | null;
  tempTodo: Todo | null;
  onSubmit: (title: string) => void;
  handleError: (errorMessage: string) => void;
  filteredTodos: Todo[];
  clearCompleted: () => void;
  handleUpdate: (todo: Todo) => Promise<void>;
  updateTodo: (todo: Todo) => void;
  completeAll: () => void;
  loaderTodoId: number | null;
  setLoaderTodoId: (number: number | null) => void;
  handleDeleteTodo: (number: number) => void;
  isDeleting: boolean,
};

export const TodosContext = React.createContext<ContextType>({
  todos: [],
  setTodos: () => {},
  query: '',
  setQuery: () => {},
  isDisabled: false,
  setIsDisabled: () => {},
  filt: FilterStatus.All,
  setFilt: () => {},
  setError: () => {},
  error: '' || null,
  tempTodo: null,
  onSubmit: () => {},
  handleError: () => {},
  filteredTodos: [],
  clearCompleted: () => {},
  handleUpdate: () => new Promise(() => {}),
  updateTodo: () => {},
  completeAll: () => {},
  loaderTodoId: null,
  setLoaderTodoId: () => {},
  handleDeleteTodo: () => {},
  isDeleting: false,
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filt, setFilt] = useState(FilterStatus.All);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loaderTodoId, setLoaderTodoId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        handleError('Unable to load todos');
      });
  }, []);

  const onSubmit = (title: string) => {
    const temporaryTodo: Todo = {
      id: Math.random(),
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setLoaderTodoId(temporaryTodo.id);
    setIsDisabled(true);

    createTodo(temporaryTodo)
      .then(newTodo => {
        setLoaderTodoId(null);
        setQuery('');
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  };

  const toBoUpdatedCallback = (upTodo: Todo) => {
    setTodos(curr => {
      const newUpdatedTodos = [...curr];
      const index = newUpdatedTodos.findIndex(el => el.id === upTodo.id);

      newUpdatedTodos.splice(index, 1, upTodo);

      return newUpdatedTodos;
    });
  };

  const updateTodo = (todo: Todo) => {
    toBoUpdatedCallback(todo);
  };

  const handleUpdate = (todo: Todo) => {
    return renameRequest(todo)
      .then(newTodo => {
        toBoUpdatedCallback(newTodo);
      })
      .catch(() => {
        handleError('Unable to update a todo');
      })
      .finally(() => {
        setLoaderTodoId(null);
      });
  };

  const sendComplete = (todo: Todo) => {
    setLoaderTodoId(todo.id);
    renameRequest(todo)
      .then(() => {
        setTodos(curr => {
          const newUpdatedTodos = [...curr];
          const index = newUpdatedTodos.findIndex(el => el.id === todo.id);

          newUpdatedTodos.splice(index, 1, todo);

          return newUpdatedTodos;
        });
      })
      .catch(() => {
        handleError('Unable to update a todo');
      })
      .finally(() => {
        setLoaderTodoId(null);
      });
  };

  const callbackToCompleteAll = (todo: Todo) => {
    setLoaderTodoId(todo.id);

    const changed = { ...todo, completed: !todo.completed };

    sendComplete(changed);
  };

  const completeAll = () => {
    const currentTodos = [...todos];
    const filteredActive = currentTodos.filter(todo => !todo.completed);

    if (filteredActive.length > 0) {
      filteredActive.map((todo) => {
        callbackToCompleteAll(todo);

        return todo;
      });
    }

    if (!filteredActive.length) {
      currentTodos.map((todo) => {
        callbackToCompleteAll(todo);

        return todo;
      });
    }

    setTodos(currentTodos);
    setLoaderTodoId(null);
  };

  const filteredTodos = todos.filter((todo: { completed: boolean; }) => {
    switch (filt) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const timerRef = useRef<number | null>(null);

  const handleDeleteTodo = useCallback((todoId: number) => {
    setLoaderTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(
          (cur: Todo[]) => cur.filter(element => element.id !== todoId),
        );
      })
      .catch(() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        window.setTimeout(() => {
          setError('Unable to delete a todo');
        }, 3000);
      })
      .finally(() => {
        setLoaderTodoId(null);
        setIsDeleting(false);
      });
  }, [isDeleting]);

  const clearCompleted = () => {
    const toDelete = todos.filter(todo => todo.completed);

    toDelete.map((todo) => {
      handleDeleteTodo(todo.id);

      return todo;
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      query,
      setQuery,
      isDisabled,
      setIsDisabled,
      filt,
      setFilt,
      setError,
      error,
      tempTodo,
      onSubmit,
      handleError,
      filteredTodos,
      handleDeleteTodo,
      handleUpdate,
      updateTodo,
      completeAll,
      loaderTodoId,
      setLoaderTodoId,
      isDeleting,
      clearCompleted,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
