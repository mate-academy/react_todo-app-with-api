import React, { useState, useEffect } from 'react';
import { Todo } from './types/Todo';
import {
  completeTodo, deleteTodo, getTodos,
} from './api/todos';

export enum Key {
  Enter = 'Enter',
  Escape = 'Escape',
}

export type PartialTodo = Omit<Todo, 'id'>;

const USER_ID = 11880;

export enum FilterBy {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const filterTodos = (todos: Todo[], filter: FilterBy): Todo[] => {
  switch (filter) {
    case FilterBy.All:
      return todos;
    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);
    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

type Props = {
  children: React.ReactNode,
};

interface Context {
  allTodos: Todo[],
  setError: React.Dispatch<React.SetStateAction<string>>
  error: string,
  completedTodos: Todo[],
  activeTodos: Todo[],
  filterBy: FilterBy,
  tempTodo: Todo | null,
  titleDisabled: boolean,
  onDelete: (todoId: number) => void
  clearCompleted: () => void
  onCompleteChange: (e: React.ChangeEvent<HTMLInputElement>,
    postId: number) => void
  setAllCompleted: () => void
  handleFilterClick: (filterType: FilterBy) => (
    event: React.MouseEvent,
  ) => void
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  renderingTodos: Todo[] | null,
  setRenderingTodos: React.Dispatch<React.SetStateAction<Todo[] | null>>
  setTitleDisabled: React.Dispatch<React.SetStateAction<boolean>>
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  newTimeout: number
  filterTodos: (todos: Todo[], filter: FilterBy) => Todo[]
}

export const TodosContext = React.createContext<Context>({
  allTodos: [],
  error: '',
  filterBy: FilterBy.All,
  tempTodo: null,
  titleDisabled: false,
  onDelete: () => {},
  clearCompleted: () => {},
  onCompleteChange: () => {},
  setAllCompleted: () => {},
  handleFilterClick: () => () => {},
  completedTodos: [],
  activeTodos: [],
  setError: () => {},
  setAllTodos: () => {},
  renderingTodos: null,
  setRenderingTodos: () => {},
  setTitleDisabled: () => {},
  setTempTodo: () => {},
  newTimeout: 3000,
  filterTodos: () => [],
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [titleDisabled, setTitleDisabled] = useState(false);
  const [renderingTodos, setRenderingTodos] = useState<Todo[] | null>(null);
  const newTimeout = 3000;

  useEffect(() => {
    getTodos(USER_ID)
      .then((usersFromServer) => {
        setAllTodos((prevAllTodos) => [...prevAllTodos, ...usersFromServer]);
      })
      .catch(() => {
        setError('Unable to load todos');

        setTimeout(() => {
          setError('');
        }, newTimeout);
      });
  }, []);

  const onDelete = (postId: number) => {
    setRenderingTodos(allTodos.filter(todo => todo.id === postId));

    deleteTodo(postId)
      .then(() => {
        setAllTodos(allTodos.filter(todo => todo.id !== postId));
      })
      .catch(() => {
        setError('Unable to delete a todo');

        setTimeout(() => {
          setError('');
        }, newTimeout);
      })
      .finally(() => {
        setRenderingTodos(null);
      });
  };

  const clearCompleted = () => {
    setRenderingTodos(allTodos.filter(todo => todo.completed === true));

    allTodos.filter(todo => {
      deleteTodo(todo.completed ? todo.id : 0)
        .then(() => {
          setAllTodos(allTodos.filter(t => !t.completed));
        })
        .catch(() => {
          setError('Unable to delete a todo');

          setTimeout(() => {
            setError('');
          }, newTimeout);
        })
        .finally(() => {
          setRenderingTodos(null);
        });

      return setAllTodos;
    });
  };

  const onCompleteChange = (e: React.ChangeEvent<HTMLInputElement>,
    postId: number) => {
    setRenderingTodos(allTodos.filter(todo => todo.id === postId));

    completeTodo({
      id: postId,
      completed: e.target.checked,
    })
      .then(() => {
        setAllTodos(allTodos.map(t => {
          if (t.id === postId) {
            return { ...t, completed: !t.completed };
          }

          return t;
        }));
      })
      .catch(() => {
        setError('Unable to update a todo');

        setTimeout(() => {
          setError('');
        }, newTimeout);
      })
      .finally(() => {
        setRenderingTodos(null);
      });
  };

  const setAllCompleted = () => {
    const allCompleted = allTodos.every(t => t.completed);

    setRenderingTodos(allTodos.filter(todo => todo.completed !== allCompleted));

    allTodos.map(todo => {
      completeTodo({
        id: todo.id,
        completed: !allCompleted,
      })
        .then(() => {
          setAllTodos(allTodos.map(t => {
            return { ...t, completed: !allCompleted };
          }));
        })
        .catch(() => {
          setError('Unable to update todos');

          setTimeout(() => {
            setError('');
          }, newTimeout);
        })
        .finally(() => {
          setRenderingTodos(null);
        });

      return setAllTodos;
    });
  };

  useEffect(() => {
    filterTodos(allTodos, filterBy);
  }, [filterBy, allTodos]);

  const handleFilterClick = (filterType: FilterBy) => (
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    setFilterBy(filterType);
  };

  const completedTodos = [...allTodos].filter(todo => todo.completed);
  const activeTodos = [...allTodos].filter(todo => !todo.completed);

  return (
    <TodosContext.Provider
      value={{
        allTodos,
        error,
        filterBy,
        tempTodo,
        titleDisabled,
        onDelete,
        clearCompleted,
        setAllCompleted,
        onCompleteChange,
        handleFilterClick,
        completedTodos,
        activeTodos,
        setError,
        setAllTodos,
        renderingTodos,
        setRenderingTodos,
        setTempTodo,
        setTitleDisabled,
        newTimeout,
        filterTodos,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
