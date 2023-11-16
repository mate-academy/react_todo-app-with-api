import React, { useState, useEffect } from 'react';
import { Todo } from './types/Todo';
import {
  addTodo, completeTodo, deleteTodo, getTodos,
} from './api/todos';

export enum Key {
  Enter = 'Enter',
  Escape = 'Escape',
}

type PartialTodo = Omit<Todo, 'id'>;

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
  filteredTodos: Todo[],
  error: string,
  completedTodos: Todo[],
  activeTodos: Todo[],
  filterBy: FilterBy,
  newTodoTitle: string,
  tempTodo: Todo | null,
  isBlured: number | null,
  allBlured: boolean,
  isRendering: boolean,
  onSubmit: (e: React.FormEvent) => void
  onDelete: (todoId: number) => void
  clearCompleted: () => void
  onCompleteChange: (e: React.ChangeEvent<HTMLInputElement>,
    postId: number) => void
  setAllCompleted: () => void
  handleFilterClick: (filterType: FilterBy) => (
    event: React.MouseEvent,
  ) => void
  setIsBlured: React.Dispatch<React.SetStateAction<number | null>>
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
}

export const TodosContext = React.createContext<Context>({
  allTodos: [],
  filteredTodos: [],
  error: '',
  filterBy: FilterBy.All,
  newTodoTitle: '',
  tempTodo: null,
  isBlured: null,
  allBlured: false,
  isRendering: false,
  handleTitleChange: () => {},
  onSubmit: () => {},
  onDelete: () => {},
  clearCompleted: () => {},
  onCompleteChange: () => {},
  setAllCompleted: () => {},
  handleFilterClick: () => () => {},
  completedTodos: [],
  activeTodos: [],
  setError: () => {},
  setAllTodos: () => {},
  setIsBlured: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isBlured, setIsBlured] = useState<number | null>(null);
  const [allBlured, setAllBlured] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const newTimeout = 3000;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };

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

  const todoData: PartialTodo = {
    userId: USER_ID,
    completed: false,
    title: newTodoTitle,
  };

  const onSubmit = (e: React.FormEvent) => {
    setError('');
    setIsRendering(true);
    e.preventDefault();
    todoData.title = newTodoTitle;

    if (todoData.title.trim() === '') {
      setError('Title should not be empty');

      todoData.title = '';
      setTimeout(() => {
        setError('');
      }, 3000);

      setIsRendering(false);

      return;
    }

    setTempTodo({
      completed: false,
      title: newTodoTitle.trim(),
      id: 0,
      userId: USER_ID,
    });

    addTodo({
      userId: USER_ID,
      completed: false,
      title: newTodoTitle.trim(),
    })
      .then((data) => {
        setNewTodoTitle('');
        setAllTodos([...allTodos, data]);
      })
      .catch(() => {
        setError('Unable to add a todo');

        setTimeout(() => {
          setError('');
        }, newTimeout);

        setTempTodo(null);
      })
      .finally(() => {
        setTempTodo(null);
        setIsRendering(false);
      });
  };

  const onDelete = (postId: number) => {
    setIsBlured(postId);

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
        setIsBlured(null);
      });
  };

  const clearCompleted = () => {
    setAllBlured(true);
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
          setAllBlured(false);
        });

      return setAllTodos;
    });
  };

  const onCompleteChange = (e: React.ChangeEvent<HTMLInputElement>,
    postId: number) => {
    setIsBlured(postId);

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
        setIsBlured(null);
      });
  };

  const setAllCompleted = () => {
    const allCompleted = allTodos.every(t => t.completed);

    setAllBlured(true);

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
          setAllBlured(false);
        });

      return setAllTodos;
    });
  };

  useEffect(() => {
    setFilteredTodos(filterTodos(allTodos, filterBy));
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
        filteredTodos,
        error,
        filterBy,
        newTodoTitle,
        tempTodo,
        isBlured,
        allBlured,
        isRendering,
        handleTitleChange,
        onSubmit,
        onDelete,
        clearCompleted,
        setAllCompleted,
        onCompleteChange,
        handleFilterClick,
        completedTodos,
        activeTodos,
        setError,
        setAllTodos,
        setIsBlured,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
