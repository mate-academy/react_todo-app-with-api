import React, {
  createContext,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import * as todoApi from '../api/todos';
import { Todo } from '../types/Todo';
import { filterTodo } from '../Services/Todo';
import { useTodoUI } from '../hooks/useTodoUI';

type TodoDataContextType = {
  todos: Todo[];
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  selectedTodoId: number | null;
  loadingIds: number[];
  isTodoListVisible: boolean;
  isTodoFooterVisible: boolean;
  setSelectedTodoId: (todoId: number | null) => void;
  setTempTodo: (todo: Todo | null) => void;
  addTodo: (title: string) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  updateTodo: (
    id: number,
    data: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>;
};

export const TodoDataContext = createContext<TodoDataContextType | null>(null);

export const TodoDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const {
    filter,
    loading,
    setLoading,
    addErrorMessage,
    clearErrorMessage,
    inputRef,
  } = useTodoUI();

  const addLoadingId = (id: number) => {
    setLoadingIds(prev => [...prev, id]);
  };

  const removeLoadingId = (id: number) => {
    setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
  };

  const addTodo = useCallback(
    async (title: string) => {
      const newTodo: Todo = {
        id: 0,
        userId: todoApi.USER_ID,
        title,
        completed: false,
      };

      clearErrorMessage();
      setTempTodo(newTodo);

      try {
        const created = await todoApi.addTodo(newTodo);

        setTodosFromServer(prev => [...prev, created]);
      } catch {
        addErrorMessage('Unable to add a todo', true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
        throw new Error();
      } finally {
        setTempTodo(null);
      }
    },
    [addErrorMessage, clearErrorMessage, inputRef],
  );

  const deleteTodo = useCallback(
    async (id: number) => {
      addLoadingId(id);
      try {
        await todoApi.deleteTodo(id);
        setTodosFromServer(prev => prev.filter(todo => todo.id !== id));
      } catch (error) {
        addErrorMessage('Unable to delete a todo', true);
        throw new Error();
      } finally {
        removeLoadingId(id);
      }
    },
    [addErrorMessage],
  );

  const updateTodo = useCallback(
    async (id: number, data: Partial<Pick<Todo, 'title' | 'completed'>>) => {
      addLoadingId(id);
      try {
        const updatedTodo = await todoApi.updateTodo(id, data);

        setTodosFromServer(prev =>
          prev.map(todo =>
            todo.id === id ? { ...todo, ...updatedTodo } : todo,
          ),
        );
      } catch (error) {
        addErrorMessage('Unable to update a todo', true);
        throw new Error();
      } finally {
        removeLoadingId(id);
      }
    },
    [addErrorMessage],
  );

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [todosFromServer.length, loading, inputRef]);

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        clearErrorMessage();
        setLoading(true);
        const response = await todoApi.getTodos();

        setTodosFromServer(response);
      } catch (error) {
        addErrorMessage('Unable to load todos', true);
      } finally {
        setLoading(false);
      }
    };

    getTodosFromServer();
  }, [addErrorMessage, clearErrorMessage, setLoading]);

  const filteredTodos = useMemo(() => {
    if (todosFromServer.length === 0) {
      return [];
    }

    return filterTodo(todosFromServer, filter);
  }, [filter, todosFromServer]);

  const isTodoListVisible = useMemo(() => {
    return filteredTodos.length > 0 && !loading;
  }, [filteredTodos.length, loading]);

  const isTodoFooterVisible = useMemo(
    () => todosFromServer.length > 0 && !loading,
    [todosFromServer.length, loading],
  );

  const value = useMemo(
    () => ({
      todos: todosFromServer,
      filteredTodos,
      tempTodo,
      selectedTodoId,
      loadingIds,
      isTodoFooterVisible,
      isTodoListVisible,
      setSelectedTodoId,
      setTempTodo,
      addTodo,
      deleteTodo,
      updateTodo,
    }),
    [
      todosFromServer,
      tempTodo,
      filteredTodos,
      selectedTodoId,
      loadingIds,
      isTodoFooterVisible,
      isTodoListVisible,
      addTodo,
      deleteTodo,
      updateTodo,
    ],
  );

  return (
    <TodoDataContext.Provider value={value}>
      {children}
    </TodoDataContext.Provider>
  );
};
