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
  tempTodo: Todo,
  filterType: string;
  pending: boolean;
  messageError: string;
  query: string;
  queryTitle: string;
  isLoadingTodo: Todo;
  status: number
  isToggled: boolean;
  editFormTodoId: number;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo>>;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
  setPending: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageError: React.Dispatch<React.SetStateAction<string>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setQueryTitle: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitSent: (event: React.FormEvent<HTMLFormElement>) => void;
  handleSubmitEdit: (event: React.FormEvent<HTMLFormElement>, todo: Todo) =>
  void;
  handleDeleteTodo: (id: number) => void;
  setIsLoadingTodo: React.Dispatch<React.SetStateAction<Todo>>
  setStatus: React.Dispatch<React.SetStateAction<number>>
  handleCheckboxClick: (todo: Todo) => void;
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleAll: () => void;
  handleChangeInputValue: () => void;
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

      try {
        setPending(true);
        setTempTodo({
          id: 0,
          title: query,
          completed: false,
          userId: USER_ID,
        });

        if (!query) {
          setMessageError(ERROR_MESSAGES[1]);
          setPending(false);

          return;
        }

        const newTodo = {
          title: query,
          completed: false,
          userId: USER_ID,
        };

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

  const handleCheckboxClick = useCallback((clickedTodo: Todo) => {
    try {
      const { id } = clickedTodo;

      setStatus(id);
      setTimeout(() => {
        setStatus(0);
        setTodos((currentTodos) => currentTodos.map((todo) => (todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo)));
      }, 500);
    } catch (error) {
      setMessageError(ERROR_MESSAGES[3]);
    }
  }, [setTodos, setMessageError, setStatus]);

  const handleSubmitEdit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>, todo: Todo) => {
      event.preventDefault();
      setStatus(todo.id);
      setEditFormTodoId(-1);

      if (todo.title === queryTitle) {
        return;
      }

      if (queryTitle === '') {
        handleDeleteTodo(todo.id);

        return;
      }

      try {
        if (!queryTitle) {
          setMessageError(ERROR_MESSAGES[1]);
          setPending(false);

          return;
        }

        const editedTodo = await patchTodo({
          id: todo.id,
          title: queryTitle,
          completed: todo.completed,
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

  const handleToggleAll = useCallback(() => {
    setIsToggled(true);

    setTimeout(() => {
      setTodos((currentTodos) => {
        const completedTodos = currentTodos.every((todo) => todo.completed);

        return currentTodos.map((todo) => ({
          ...todo,
          completed: !completedTodos,
        }));
      });

      setIsToggled(false);
    }, 500);
  }, [setTodos]);

  useEffect(() => {
    switch (filterType) {
      case 'All':
        setFilteredTodos(todos);
        break;
      case 'Active':
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case 'Completed':
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
    }),
    [
      todos,
      filteredTodos,
      tempTodo,
      filterType,
      pending,
      messageError,
      query,
      isLoadingTodo,
      status,
      isToggled,
      editFormTodoId,
      handleSubmitSent,
      handleSubmitEdit,
      handleDeleteTodo,
      handleCheckboxClick,
      handleToggleAll,
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
