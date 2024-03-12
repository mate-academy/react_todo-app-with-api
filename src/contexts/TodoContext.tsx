import React, {
  useState, useEffect,
} from 'react';
import { TodoContextType } from '../types/TodoContextType';
import { Todo } from '../types/Todo';
import { TypeOfFiltering } from '../types/TypeOfFiltering';
import { ErrorType } from '../types/ErrorType';
import { client } from '../utils/fetchClient';
import { UserWarning } from '../UserWarning';

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  tempTodo: null,
  changeData: () => {},
  deleteData: () => {},
  filterType: TypeOfFiltering.All,
  setFilterType: () => {},
  dataError: '',
  setError: () => {},
  Error: () => {},
  addTodo: () => {},
  editTodo: -1,
  setEditTodo: () => {},
  changeTodo: () => {},
  activeLoader: [],
  shouldFocus: true,
  setInputValue: () => {},
  inputValue: '',
  setTodos: () => {},
});

type Props = {
  children: React.ReactNode,
};

const USER_ID = 9940;

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState<TypeOfFiltering>(
    TypeOfFiltering.All,
  );
  const [dataError, setError] = useState<string>('');
  const [activeLoader, setActiveLoader] = useState<number[]>([]);
  const [shouldFocus, setShouldFocus] = useState<boolean>(true);
  const [editTodo, setEditTodo] = useState<number>(-1);
  const [inputValue, setInputValue] = useState('');

  let timeoutId: ReturnType<typeof setTimeout>;

  const Error = (error: ErrorType) => {
    setError(error);

    timeoutId = setTimeout(() => {
      setError('');
    }, 3000);
  };

  const getTodos = () => {
    return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
  };

  const fetchData = async () => {
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch {
      Error(ErrorType.Load);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (todoId: number) => {
    return client.delete(`/todos/${todoId}`);
  };

  const changeTodo = (
    todoId: number,
    title: string,
    completed: boolean,
  ) => {
    return client.patch(
      `/todos/${todoId}`,
      {
        title,
        completed,
      },
    );
  };

  const createTodo = ({
    userId, title, completed,
  }: Omit<Todo, 'id'>) => {
    return client.post<Todo>('/todos', {
      userId, title, completed,
    });
  };

  const addTodo = async (value: string) => {
    setTempTodo({
      id: 0,
      userId: 9940,
      title: value,
      completed: false,
    });
    setError('');

    try {
      const newTodo = await createTodo({
        userId: 9940,
        title: value,
        completed: false,
      });

      setTodos(currrentTodos => {
        return ([...currrentTodos, newTodo]);
      });

      setInputValue('');
    } catch (error) {
      Error(ErrorType.Add);
    } finally {
      setTempTodo(null);
      setShouldFocus(true);
    }
  };

  const deleteData = async (todoId: number) => {
    setActiveLoader(prev => {
      return [...prev, todoId];
    });
    try {
      await deleteTodo(todoId);

      setTodos((prev) => {
        return [...prev].filter(todo => todo.id !== todoId);
      });
    } catch {
      Error(ErrorType.Delete);
    } finally {
      setActiveLoader([]);
    }
  };

  const changeData = async (
    todoId: number,
    title: string,
    completed: boolean,
  ) => {
    setActiveLoader(prev => {
      return [...prev, todoId];
    });

    if (title.length === 0) {
      deleteData(todoId);
    } else {
      try {
        await changeTodo(todoId, title, completed);

        setEditTodo(-1);

        setTodos((prev) => {
          return prev.map(currentTodo => {
            if (currentTodo.id === todoId) {
              return {
                ...currentTodo,
                title,
                completed,
              };
            }

            return currentTodo;
          });
        });
      } catch {
        Error(ErrorType.Update);

        if (todos[editTodo].title !== title) {
          setEditTodo(todoId);
        }

        // setEditTodo(todoId);

        setEditTodo(-1);
      } finally {
        setActiveLoader([]);
        setShouldFocus(false);
      }
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        tempTodo,
        filterType,
        changeData,
        deleteData,
        setFilterType,
        dataError,
        setError,
        Error,
        addTodo,
        editTodo,
        setEditTodo,
        changeTodo,
        activeLoader,
        shouldFocus,
        setInputValue,
        inputValue,
        setTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
