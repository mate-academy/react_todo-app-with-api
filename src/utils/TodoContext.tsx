import React, {
  createContext,
  useContext,
  useState,
  FC,
  useEffect,
} from 'react';
import { Todo } from '../types/Todo';
import { TodosContextType } from '../types/TodosContextType';
import { Filter } from '../types/Filter';
import {
  deleteTodoFromServer,
  getTodos,
  renameTodoOnServer,
  sendTodoToServer,
  toggleStatusTodo,
} from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

const initialTodos: Todo[] = [];

const TodosContext = createContext<TodosContextType>({
  todos: initialTodos,
  filter: Filter.ALL,
  addTodo: () => {},
  removeTodo: () => {},
  renameTodo: () => {},
  toggleTodo: () => {},
  toggleAllTodos: () => {},
  setTodos: () => {},
  setFilter: () => {},
  query: '',
  setQuery: () => {},
  error: ErrorMessage.NO_ERRORS,
  setError: () => {},
  isLoading: false,
  setIsLoading: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  loadingTodosIDs: [],
  setLoadingTodosIDs: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.NO_ERRORS);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodosIDs, setLoadingTodosIDs] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);
    setLoadingTodosIDs(prev => [...prev, 0]);

    sendTodoToServer(newTodo)
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response]);
        setQuery('');
      })
      .catch(() => {
        setError(ErrorMessage.ADD_TODO_ERROR);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        setLoadingTodosIDs(prev => prev.filter(todoId => todoId !== 0));
      });
  };

  const removeTodo = (id: number) => {
    setIsLoading(true);
    setLoadingTodosIDs(prev => [...prev, id]);
    deleteTodoFromServer(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorMessage.DELETE_TODO_ERROR);
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodosIDs(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const toggleTodoStatus = (id: number, status: boolean) => {
    setIsLoading(true);
    setLoadingTodosIDs(prev => [...prev, id]);

    const todoToUpdate = todos.find(todo => todo.id === id);

    if (todoToUpdate) {
      toggleStatusTodo(id, status)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.map(prev =>
              prev.id === id ? { ...prev, completed: status } : prev,
            ),
          );
        })
        .catch(() => {
          setError(ErrorMessage.UPDATE_TODO_ERROR);
        })
        .finally(() => {
          setIsLoading(false);
          setLoadingTodosIDs(prev => prev.filter(todoId => todoId !== id));
        });
    }
  };

  const toggleTodo = (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (todoToUpdate) {
      toggleTodoStatus(id, !todoToUpdate.completed);
    }
  };

  const toggleAllTodos = (status: boolean) => {
    todos.forEach(todo => {
      if (todo.completed !== status) {
        toggleTodoStatus(todo.id, status);
      }
    });
  };

  const renameTodo = (
    id: number,
    newTitle: string,
    setEditingTodoId: (id: number | null) => {},
  ) => {
    setIsLoading(true);
    setLoadingTodosIDs(prev => [...prev, id]);

    renameTodoOnServer(id, newTitle)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(prev =>
            prev.id === id ? { ...prev, title: newTitle } : prev,
          ),
        );
        setEditingTodoId(null);
      })
      .catch(() => {
        setError(ErrorMessage.UPDATE_TODO_ERROR);
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodosIDs(prev => prev.filter(todoId => todoId !== id));
      });
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        setError(ErrorMessage.UNABLE_LOAD_TODOS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        addTodo,
        removeTodo,
        renameTodo,
        toggleTodo,
        toggleAllTodos,
        setFilter,
        filter,
        query,
        setQuery,
        error,
        setError,
        isLoading,
        setIsLoading,
        loadingTodosIDs,
        setLoadingTodosIDs,
        tempTodo,
        setTempTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext);
