import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../api/todos';
import { FilterStatus } from '../types/FilterStatus';
import { ErrorStatus } from '../types/ErrorsStatus';
import { Todo } from '../types/Todo';
import { wait } from '../utils/fetchClient';

type Props = {
  children: React.ReactNode;
};

type TodosContextType = {
  todos: Todo[];
  status: FilterStatus;
  setStatus: (status: FilterStatus) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  shouldClearInput: boolean;
  setShouldClearInput: (shouldClearInput: boolean) => void;
  errorMessage: ErrorStatus;
  setErrorMessage: (errorMessage: ErrorStatus) => void;
  editTodoByID: number | null;
  setEditTodoByID: (editTodoByID: number | null) => void;
  onHandleSubmit: (title: string) => void;
  onHandleDeleteTodo: (id: number) => void;
  onHandleUpdateTodo: (id: number, title: string, completed: boolean) => void;
  loadingTodos: Set<number>;
};

const defaultContextValue: TodosContextType = {
  todos: [],
  status: FilterStatus.ALL,
  setStatus: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
  shouldClearInput: true,
  setShouldClearInput: () => {},
  errorMessage: ErrorStatus.NoError,
  setErrorMessage: () => {},
  editTodoByID: null,
  setEditTodoByID: () => {},
  onHandleSubmit: () => {},
  onHandleDeleteTodo: () => {},
  onHandleUpdateTodo: () => {},
  loadingTodos: new Set<number>(),
};

export const TodosContext =
  createContext<TodosContextType>(defaultContextValue);

export const useTodosContext = () => useContext(TodosContext);

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<FilterStatus>(FilterStatus.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState(new Set<number>());
  const [shouldClearInput, setShouldClearInput] = useState(true);
  const [editTodoByID, setEditTodoByID] = useState<number | null>(null);

  const [errorMessage, setErrorMessage] = useState<ErrorStatus>(
    ErrorStatus.NoError,
  );

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorStatus.LoadError);
        wait(3000).then(() => {
          setErrorMessage(ErrorStatus.NoError);
        });
      });
  }, []);

  const onHandleSubmit = (title: string) => {
    const trimmedTitle = title.trim();

    setLoadingTodos(prev => new Set(prev.add(0)));
    if (!trimmedTitle) {
      setErrorMessage(ErrorStatus.TitleError);
      wait(3000).then(() => {
        setErrorMessage(ErrorStatus.NoError);
      });

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      userId: USER_ID,
      id: 0,
      title: trimmedTitle,
      completed: false,
    });

    addTodo(trimmedTitle)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setShouldClearInput(true);
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.AddTodoError);
        wait(3000).then(() => setErrorMessage(ErrorStatus.NoError));
        setShouldClearInput(false);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
        setLoadingTodos(prev => {
          const newSet = new Set(prev);

          newSet.delete(0);

          return newSet;
        });
      });
  };

  const onHandleDeleteTodo = (id: number) => {
    setLoadingTodos(prev => new Set(prev.add(id)));
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.RemoveTodoError);
        wait(3000).then(() => {
          setErrorMessage(ErrorStatus.NoError);
        });
      })
      .finally(() => {
        setLoadingTodos(prev => {
          const newSet = new Set(prev);

          newSet.delete(id);

          return newSet;
        });
      });
  };

  const onHandleUpdateTodo = (
    id: number,
    newTitle: string,
    completed: boolean,
  ) => {
    setLoadingTodos(prev => new Set(prev.add(id)));
    const originalTodo = todos.find(todo => todo.id === id);
    const isTitleChanged = originalTodo && originalTodo.title !== newTitle;

    setEditTodoByID(null);

    updateTodo(id, newTitle, completed)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, title: newTitle, completed } : todo,
          ),
        );
        setLoadingTodos(prev => {
          const updatedSet = new Set(prev);

          updatedSet.delete(id);

          return updatedSet;
        });
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.UpdateTodoError);
        if (isTitleChanged) {
          setEditTodoByID(id);
        }

        wait(3000).then(() => {
          setErrorMessage(ErrorStatus.NoError);
        });
      })
      .finally(() => {
        setLoadingTodos(prev => {
          const newSet = new Set(prev);

          newSet.delete(id);

          return newSet;
        });
      });
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        status,
        setStatus,
        tempTodo,
        setTempTodo,
        isSubmitting,
        setIsSubmitting,
        onHandleSubmit,
        onHandleDeleteTodo,
        onHandleUpdateTodo,
        loadingTodos,
        shouldClearInput,
        errorMessage,
        setErrorMessage,
        editTodoByID,
        setEditTodoByID,
        setShouldClearInput,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
