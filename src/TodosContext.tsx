import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import * as postService from './api/todos';

type Props = {
  children: React.ReactNode;
};

type ContextType = {
  todos: Todo[];
  selectedFilter: Selected;
  loader: boolean;
  errorMessage: string;
  lastTodo: Todo | null;
  setLastTodo: (value: Todo | null) => void;
  setLoader: (value: boolean) => void;
  loadPost: () => void;
  setSelectedFilter: (value: Selected) => void;
  showFilteredTodos: (value: Selected) => Todo[];
  setTodos: (prevTodos: Todo[]) => void;
  addTodo: (todo: Todo, titleField: HTMLInputElement) => Promise<void>;
  deleteTodo: (id: number) => void;
  deleteCompleted: () => void;
  toggleTodoCompleted: (id: number, completed: boolean) => void;
  editTodo: (id: number, title: string) => void;
  setErrorMessage: (value: string) => void;
};

enum Selected {
  'all',
  'active',
  'completed',
}

export const TodosContext = React.createContext<ContextType>({
  todos: [],
  selectedFilter: Selected.all,
  loader: false,
  errorMessage: '',
  lastTodo: null,
  setLastTodo: () => {},
  setLoader: () => {},
  loadPost: () => {},
  setSelectedFilter: () => Selected.all,
  showFilteredTodos: () => [],
  setTodos: () => [],
  addTodo: async () => {},
  deleteTodo: () => {},
  deleteCompleted: () => {},
  toggleTodoCompleted: () => {},
  editTodo: () => {},
  setErrorMessage: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastTodo, setLastTodo] = useState<Todo | null>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Selected>(Selected.all);

  const loadPost = () => {
    setLoader(true);

    postService
      .getTodos()
      .then(res => {
        setTodos(res);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    loadPost();
  }, []);

  const showFilteredTodos = (value: Selected): Todo[] => {
    switch (value) {
      case Selected.active:
        return todos.filter(item => !item.completed);
      case Selected.completed:
        return todos.filter(item => item.completed);
      default:
        return todos;
    }
  };

  const addTodo = (
    { userId, title, completed }: Todo,
    titleFieldRef: HTMLInputElement,
  ) => {
    if (titleFieldRef) {
      /* eslint-disable no-param-reassign */
      titleFieldRef.disabled = true;
    }

    return postService
      .addTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setLoader(false);
        setLastTodo(null);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        if (titleFieldRef) {
          /* eslint-disable no-param-reassign */
          titleFieldRef.disabled = false;
          titleFieldRef.focus();
        }
      });
  };

  const deleteTodo = (id: number) => {
    setLoader(true);

    postService
      .deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(currentTodo => currentTodo.id !== id));
        setLoader(false);
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      });
  };

  const deleteCompleted = () => {
    const completedTodos = todos
      .filter(todo => todo.completed)
      .map(item => item);

    setLoader(true);

    Promise.allSettled(completedTodos).then(res =>
      res.forEach(item => {
        if (item.status === 'fulfilled') {
          postService.deleteTodo(item.value.id);
        }
      }),
    );

    setTodos(todos.filter(item => !item.completed));
    setLoader(false);
  };

  const toggleTodoCompleted = (id: number, completed: boolean) => {
    const prevTodos = todos;

    postService
      .toggleCompleted(id, completed)
      .then(() => {
        setTodos(
          todos.map(currentTodo => {
            if (currentTodo.id === id) {
              return { ...currentTodo, completed: !currentTodo.completed };
            }

            return currentTodo;
          }),
        );
      })
      .catch(error => {
        setTimeout(() => {
          setTodos(prevTodos);
        }, 1000);
        setErrorMessage('Unable to update a todo');
        throw error;
      });
  };

  const editTodo = (id: number, title: string) => {
    const prevTodos = todos;

    postService
      .editTodo(id, title)
      .then(() => {
        const currentTitle = title.trim();

        setTodos(
          todos.map(item => {
            if (id === item.id) {
              return { ...item, title: currentTitle };
            }

            return item;
          }),
        );
      })
      .catch(error => {
        setTodos(prevTodos);
        setErrorMessage('Unable to update a todo');
        throw error;
      });
  };

  const value = useMemo(
    () => ({
      todos,
      selectedFilter,
      loader,
      errorMessage,
      lastTodo,
      setLastTodo,
      setLoader,
      loadPost,
      setSelectedFilter,
      showFilteredTodos,
      setTodos,
      addTodo,
      deleteTodo,
      deleteCompleted,
      toggleTodoCompleted,
      editTodo,
      setErrorMessage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todos, selectedFilter, errorMessage],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
