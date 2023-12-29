import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';

import { Todo } from '../types/Todo';
import {
  getTodos, addTodo, deleteTodo, patchTodo,
} from '../api/todos';

type TodoContextType = {
  todos: Todo[];
  filteredTodos: Todo[];
  tempTodo: Todo | null
  filterType: string;
  pending: boolean;
  messageError: string;
  query: string;
  queryTitle: string;
  isLoadingTodo: Todo | null;
  status: number
  isToggled: boolean;
  editFormTodoId: number;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
  setPending: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setQueryTitle: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitSent: (event: React.FormEvent<HTMLFormElement>) => void;
  handleSubmitEdit: (event: React.FormEvent<HTMLFormElement>, todo: Todo) =>
  void;
  handleDeleteTodo: (id: number) => void;
  setIsLoadingTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  setStatus: React.Dispatch<React.SetStateAction<number>>;
  handleCheckboxClick: (todo: Todo) => void;
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleAll: () => void;
  handleClearCompleted: () => void;
  setEditFormTodoId: React.Dispatch<React.SetStateAction<number>>;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const USER_ID = 12060;

const ERROR_MESSAGES = [
  'Unable to load todos',
  'Title should not be empty',
  'Unable to add a todo',
  'Unable to delete a todo',
  'Unable to update a todo',
];

enum SortType {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const TodoProvider: React.FC<{ children: ReactNode }> = (
  { children },
) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [pending, setPending] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [queryTitle, setQueryTitle] = useState<string>('');
  const [isLoadingTodo, setIsLoadingTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<number>(-1);
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [editFormTodoId, setEditFormTodoId] = useState<number>(-1);

  const fetchTodos = useCallback(
    async (messageId: number) => {
      try {
        const allTodos = await getTodos(USER_ID);

        setTodos(allTodos);
      } catch (error) {
        setMessageError(ERROR_MESSAGES[messageId]);
      }
    },
    [setTodos, setMessageError],
  );

  useEffect(() => {
    fetchTodos(0);
  }, [fetchTodos]);

  const handleSubmitSent = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // eslint-disable-next-line no-console
      console.log(query);

      if (!query) {
        setMessageError(ERROR_MESSAGES[1]);
        setPending(false);

        return;
      }

      try {
        setPending(true);
        setTempTodo({
          id: 0,
          title: query,
          completed: false,
          userId: USER_ID,
        });

        const newTodo = {
          title: query,
          completed: false,
          userId: USER_ID,
        };
        // eslint-disable-next-line
        const addedTodo = await addTodo(newTodo);

        setQuery('');
        setTodos((currentTodo) => [...currentTodo, addedTodo]);
      } catch (error) {
        setMessageError(ERROR_MESSAGES[2]);
      } finally {
        setMessageError('');
        setPending(false);
        setTempTodo(null);
      }
    },
    [setQuery, setMessageError, query],
  );

  const handleDeleteTodo = useCallback(
    async (id: number) => {
      try {
        setStatus(id);
        setIsLoadingTodo(todos.find(todo => todo.id === id) || null);
        setTimeout(() => {
          setStatus(0);
          setTodos(
            currentTodos => currentTodos.filter(todo => todo.id !== id),
          );
        }, 500);
        await deleteTodo(id);
      } catch (error) {
        setMessageError(ERROR_MESSAGES[3]);
      }
    },
    [todos],
  );

  const handleCheckboxClick = useCallback(async (clickedTodo: Todo) => {
    try {
      const { id } = clickedTodo;

      setStatus(id);

      const allTodos = await getTodos(USER_ID);

      const todoInAPI = allTodos.find((todo) => todo.id === id);

      if (!todoInAPI) {
        setMessageError(ERROR_MESSAGES[4]);

        return;
      }

      try {
        const updatedTodo = await patchTodo({
          id: clickedTodo.id,
          title: clickedTodo.title,
          completed: !clickedTodo.completed,
          userId: USER_ID,
        });

        setTodos(
          (currentTodos) => currentTodos.map(
            (todo) => (todo.id === updatedTodo.id ? updatedTodo : todo),
          ),
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }

      setTimeout(() => {
        setStatus(0);
      }, 500);
    } catch (error) {
      setMessageError(ERROR_MESSAGES[3]);
    }
  }, [setTodos, setMessageError, setStatus]);

  const handleSubmitEdit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>, editTodo: Todo) => {
      event.preventDefault();

      const allTodos = await getTodos(USER_ID);

      const todoInAPI = allTodos.find((todo) => todo.id === editTodo.id);

      if (!todoInAPI) {
        setMessageError(ERROR_MESSAGES[4]);

        return;
      }

      setEditFormTodoId(-1);

      if (editTodo.title === queryTitle) {
        return;
      }

      if (queryTitle === '') {
        handleDeleteTodo(editTodo.id);

        return;
      }

      setStatus(editTodo.id);

      try {
        if (!queryTitle) {
          setMessageError(ERROR_MESSAGES[1]);
          setPending(false);

          return;
        }

        const editedTodo = await patchTodo({
          id: editTodo.id,
          title: queryTitle,
          completed: editTodo.completed,
          userId: USER_ID,
        });

        setQueryTitle('');
        setTodos(
          (currentTodos) => currentTodos.map(
            // eslint-disable-next-line @typescript-eslint/no-shadow
            (todo) => (todo.id === editedTodo.id ? editedTodo : todo),
          ),
        );
      } catch (error) {
        setMessageError(ERROR_MESSAGES[2]);
      } finally {
        setStatus(-1);
      }
    },
    [
      setTodos,
      setQueryTitle,
      queryTitle,
      handleDeleteTodo,
    ],
  );

  const handleToggleAll = useCallback(async () => {
    setIsToggled(true);

    const completedTodos = todos.every((todo) => todo.completed);

    try {
      const allTodos = await getTodos(USER_ID);

      allTodos.forEach(async (todo) => {
        try {
          await patchTodo({
            id: todo.id,
            title: todo.title,
            completed: !completedTodos,
            userId: USER_ID,
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
          setMessageError(ERROR_MESSAGES[5]);
        }
      });

      setTodos((currentTodos) => currentTodos.map((todo) => ({
        ...todo,
        completed: !completedTodos,
      })));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      setMessageError(ERROR_MESSAGES[3]);
    } finally {
      setTimeout(() => {
        setIsToggled(false);
      }, 500);
    }
  }, [setTodos, setIsToggled, todos]);

  const handleClearCompleted = useCallback(() => {
    setIsToggled(true);

    setTimeout(async () => {
      try {
        const completedTodos = todos.filter((todo) => todo.completed);

        await Promise.all(
          completedTodos.map(async (todo) => {
            await handleDeleteTodo(todo.id);
          }),
        );

        setTodos(
          (currentTodos) => currentTodos.filter((todo) => !todo.completed),
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      } finally {
        setIsToggled(false);
      }
    }, 500);
  }, [todos, setTodos, setIsToggled, handleDeleteTodo]);

  useEffect(() => {
    switch (filterType) {
      case SortType.all:
        setFilteredTodos(todos);
        break;
      case SortType.active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case SortType.completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      default:
        break;
    }
  }, [filterType, todos, setFilteredTodos]);

  if (messageError) {
    setTimeout(() => {
      setMessageError('');
    }, 3000);
  }

  const memoizedValue = useMemo(
    () => ({
      todos,
      filteredTodos,
      tempTodo,
      filterType,
      messageError,
      query,
      queryTitle,
      pending,
      isLoadingTodo,
      status,
      isToggled,
      editFormTodoId,
      setTodos,
      setFilteredTodos,
      setTempTodo,
      setFilterType,
      setPending,
      setMessageError,
      setQuery,
      setQueryTitle,
      handleSubmitSent,
      handleSubmitEdit,
      handleDeleteTodo,
      setIsLoadingTodo,
      handleCheckboxClick,
      handleToggleAll,
      setEditFormTodoId,
      handleClearCompleted,
      setStatus,
      setIsToggled,
    }),
    [
      todos,
      filteredTodos,
      tempTodo,
      filterType,
      pending,
      messageError,
      query,
      queryTitle,
      isLoadingTodo,
      status,
      isToggled,
      editFormTodoId,
      handleSubmitSent,
      handleSubmitEdit,
      handleDeleteTodo,
      handleCheckboxClick,
      handleToggleAll,
      handleClearCompleted,
    ],
  );

  return (
    <TodoContext.Provider value={memoizedValue}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }

  return context;
};
