import React, {
  Dispatch,
  ReactNode, SetStateAction, useEffect, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import {
  addTodo, changeTodoStatus, deleteTodo, getTodos, updateTodo,
} from '../api/todos';
import { ErrorEnum } from '../types/Error';

export const USER_ID = 11552;

export enum FilterOption {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

type Props = {
  children: ReactNode;
};

interface ContextValues {
  todos: Todo[],
  visibleTodos: Todo[],
  activeTodosAmount: number,
  error: string | null,
  filter: string,
  setError: (val: string | null) => void,
  setFilter: (filter: FilterOption) => void,
  deleteTodoAction: (id: number) => void,
  tempTodo: Todo | null,
  loadingItems: number[],
  clearCompleted: () => void,
  setTodos: Dispatch<SetStateAction<Todo[]>>
  addTodoAction: (val: string) => void,
  isLoading: boolean,
  title: string,
  setTitle: (val: string) => void,
  changeTodoStatusAction: (todo: Todo) => void,
  updateTodoAction: (newTitle: string, id: number) => void,
  toggleAllStatus: () => void,
}

export const TodoContext = React.createContext({} as ContextValues);

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterOption>(FilterOption.all);
  const [error, setError] = useState<string | null>(null);
  const [loadingItems, setLoadingItems] = useState<number[]>([]);
  const [isLoading, setLoading] = useState(false);
  const activeTodosAmount = todos.filter((todo) => !todo.completed).length;

  useEffect(() => {
    setError(null);

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorEnum.loadError));
  }, []);
  const filterTodos = (
    array: Todo[], selectedFilterOption: FilterOption,
  ) => {
    return array.filter(todo => {
      switch (selectedFilterOption) {
        case FilterOption.active:
          return !todo.completed;
        case FilterOption.completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  };

  const visibleTodos: Todo[] = useMemo(() => filterTodos(todos, filter),
    [todos, filter]);

  const deleteTodoAction = (id: number) => {
    setLoadingItems((prev) => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodos((prev) => prev.filter((item) => item.id !== id));
      })
      .catch(() => setError(ErrorEnum.deleteError))
      .finally(() => {
        setLoadingItems((prev) => prev.filter((itemId) => itemId !== id));
      });
  };

  const addTodoAction = (value: string) => {
    setTempTodo({
      title: value,
      id: 0,
      completed: false,
      userId: USER_ID,
    });
    addTodo(value.trim(), USER_ID)
      .then((data: Todo) => {
        setTodos((prev) => [...prev, data]);
        setTitle('');
      })
      .catch(() => {
        setError(ErrorEnum.addError);
      })
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });
  };

  const changeTodoStatusAction = (todo: Todo) => {
    const { id, completed } = todo;

    setLoadingItems((prev) => [...prev, id]);
    const newStatus = !completed;

    changeTodoStatus(id, newStatus)
      .then(() => {
        setTodos((prev) => prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              completed: newStatus,
            };
          }

          return item;
        }));
      })
      .catch(() => {
        setError(ErrorEnum.updateError);
      })
      .finally(() => {
        setLoadingItems((prev) => prev.filter((itemId) => itemId !== id));
      });
  };

  const updateTodoAction = (newTitle: string, id: number) => {
    setLoadingItems((prev) => [...prev, id]);
    updateTodo(title, id)
      .then(() => {
        setTodos((prev) => prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              title: newTitle,
            };
          }

          return item;
        }));
      })
      .catch(() => {
        setError(ErrorEnum.updateError);
      })
      .finally(() => {
        setLoadingItems((prev) => prev.filter((itemId) => itemId !== id));
      });
  };

  const toggleAllStatus = () => {
    const isActive = visibleTodos.some((item) => !item.completed);

    visibleTodos.forEach((todo: Todo) => {
      if (todo.completed !== isActive) {
        changeTodoStatusAction(todo);
      }
    });
  };

  const clearCompleted = () => {
    todos.forEach((todo) => {
      if (todo.completed) {
        deleteTodoAction(todo.id);
      }
    });
  };

  const contextValues: ContextValues = useMemo(() => ({
    todos,
    visibleTodos,
    activeTodosAmount,
    error,
    setError,
    filter,
    setFilter,
    deleteTodoAction,
    tempTodo,
    setTodos,
    loadingItems,
    clearCompleted,
    addTodoAction,
    isLoading,
    setTitle,
    title,
    changeTodoStatusAction,
    toggleAllStatus,
    updateTodoAction,
  }), [
    visibleTodos,
    activeTodosAmount,
    error,
    filter,
    tempTodo,
    loadingItems,
    title,
    isLoading,
  ]);

  return (
    <TodoContext.Provider value={contextValues}>
      {children}
    </TodoContext.Provider>
  );
};
