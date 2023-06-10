import {
  FormEvent,
  ReactNode,
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { Filters } from '../types/Filters';

interface TodosContextInterface {
  filteredTodos: Todo[],
  todos: Todo[];
  setTodos(todos: Todo[]): void;
  createNewTodo(event: FormEvent): void;
  messageError: string;
  setMessageError(message: string): void;
  value: string;
  setValue(text: string): void;
  tempTodo: Todo | null;
  handleToggleComplete(): void;
  loading: boolean;
  setLoading(load: boolean): void;
  handleDeleteTodo(todo: Todo): void;
  handleDeleteCompleted(): void;
  handleClickCheck(todo: Todo): void;
  editTitle(id: number, title: string): void;
  setFiltered(filtered: Filters): void;
  filtered: Filters;
}

export const TodosContext = createContext<TodosContextInterface>(
  {
    todos: [],
    filteredTodos: [],
    setTodos: () => { },
    createNewTodo: () => { },
    messageError: '',
    setMessageError: () => { },
    value: '',
    setValue: () => { },
    tempTodo: null,
    handleToggleComplete: () => { },
    loading: false,
    setLoading: () => { },
    handleDeleteTodo: () => { },
    handleDeleteCompleted: () => { },
    handleClickCheck: () => { },
    editTitle: () => { },
    setFiltered: () => { },
    filtered: Filters.All,
  },
);

export const TodosConstextProvider = (
  { children }: {
    children: ReactNode
  },
) => {
  const [messageError, setMessageError] = useState('');
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState<Filters>(Filters.All);

  const filteredTodos = useMemo(() => {
    let newTodos = todos;

    switch (filtered) {
      case 'Active':
        newTodos = newTodos.filter(todo => !todo.completed);
        break;
      case 'Completed':
        newTodos = newTodos.filter(todo => todo.completed);
        break;
      case 'All':
        newTodos = todos;
        break;
      default: throw new Error('wrong filters');
    }

    return newTodos;
  }, [todos]);
  const USER_ID = 10529;
  const url = `/todos?userId=${USER_ID}`;

  if (messageError) {
    setTimeout(() => setMessageError(''), 3000);
  }

  useEffect(() => {
    const loadingData = async () => {
      await client.get<Todo[]>(url).then(response => {
        return setTodos(response);
      }).catch(() => setMessageError('Unable loading todos'));
    };

    loadingData();
  }, [todos]);

  const createNewTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!value) {
      setMessageError('Title can\'t be empty');
    } else {
      const newTodo: Todo = {
        id: 0,
        title: value,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(newTodo);

      try {
        await client.post(url, newTodo);
        setTodos(prevState => [...prevState, newTodo]);
      } catch {
        setMessageError('Unable to add a todo');
      } finally {
        setValue('');
        setTempTodo(null);
        setMessageError('');
      }
    }
  }, [todos]);

  const handleToggleComplete = useCallback(async () => {
    setLoading(true);
    const newTodos = todos.map(async todo => {
      let newTodo: Todo;
      const { id, title, userId } = todo;

      if (todos.find(tod => !tod.completed)) {
        newTodo = {
          id,
          title,
          userId,
          completed: true,
        };
      } else {
        newTodo = {
          id,
          title,
          userId,
          completed: false,
        };
      }

      const data = {
        completed: newTodo.completed,
      };
      const urlId = `/todos/${newTodo.id}?userId=${USER_ID}`;

      const patchedTodo = await client.patch(urlId, data)
        .catch(() => setMessageError('Unable to update a todo'))
        .finally(() => {
          setLoading(false);
        });

      return patchedTodo;
    });

    return newTodos;
  }, [filteredTodos]);

  const handleDeleteCompleted = useCallback(() => {
    const filterdTodos = todos
      .map(todo => {
        if (todo.completed) {
          const uniqUrl = `/todos/${todo.id}?userId=${USER_ID}`;

          return client.delete(uniqUrl)
            .catch(() => setMessageError('Unable to delete a todo'));
        }

        return todo;
      });

    return filterdTodos;
  }, [filteredTodos]);

  const handleDeleteTodo = useCallback(async (todo: Todo) => {
    const urlId = `/todos/${todo.id}?userId=${USER_ID}`;

    try {
      return await client.delete(urlId);
    } catch {
      return setMessageError('Unable to delete a todo');
    }
  }, [filteredTodos]);

  const handleClickCheck = useCallback(async (todo: Todo) => {
    setLoading(true);
    const { id } = todo;
    const urlId = `/todos/${id}?userId=${USER_ID}`;
    let data;

    if (todo.completed === false) {
      data = { completed: true };
    } else {
      data = { completed: false };
    }

    setLoading(false);

    try {
      return await client.patch(urlId, data);
    } catch {
      return setMessageError('Unable to update a todo');
    }
  }, [filteredTodos]);

  const editTitle = useCallback((id: number, title: string) => {
    if (title.trim() === '') {
      const findEmptyTitle = todos.find(todo => todo.id === id);

      return findEmptyTitle && handleDeleteTodo(findEmptyTitle);
    }

    const urlId = `/todos/${id}?userId=${USER_ID}`;
    const data = { title };

    return client.patch(urlId, data)
      .catch(() => setMessageError('Unable to update a todo'));
  }, [filteredTodos]);

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      createNewTodo,
      value,
      setValue,
      messageError,
      setMessageError,
      tempTodo,
      handleToggleComplete,
      loading,
      setLoading,
      handleDeleteTodo,
      handleDeleteCompleted,
      handleClickCheck,
      editTitle,
      filteredTodos,
      setFiltered,
      filtered,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodosContext = () => useContext(TodosContext);
