import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TodoUpdate, Todo } from './types/Todo';
import { ErrorType, FilterType, TodosInfo } from './types/HelperTypes';
import { getFilteredTodos, getTodosInfo } from './Helper';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { UserWarning } from './UserWarning';

const USER_ID = 10923;

const initialTodosInfo: TodosInfo = {
  length: 0,
  countOfActive: 0,
  hasCompleted: false,
};

const initialTodo: Todo = {
  id: 0,
  userId: USER_ID,
  completed: false,
  title: '',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [todosInfo, setTodosInfo] = useState<TodosInfo>(initialTodosInfo);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const loadTodos = async () => {
    setErrorType(null);

    try {
      const loadedTodos: Todo[] = await getTodos(USER_ID);

      setTodos(loadedTodos);
    } catch {
      setErrorType(ErrorType.DATALOADING);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos: Todo[] = useMemo(() => {
    const filteredTodos = getFilteredTodos(todos, filterType);

    setTodosInfo(getTodosInfo(todos));

    return filteredTodos;
  }, [todos, filterType]);

  const addTodo = useCallback(async (title: string) => {
    try {
      setTempTodo({
        ...initialTodo,
        title,
      });

      const newTodo: Todo = await postTodo(title);

      setTodos((prevTodos) => [
        ...prevTodos,
        newTodo,
      ]);
    } catch {
      setErrorType(ErrorType.ADD_UNABLE);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    try {
      const removedTodo = await deleteTodo(id);

      if (removedTodo) {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
      }
    } catch {
      setErrorType(ErrorType.DELETE_UNABLE);
    }
  }, []);

  const removeCompletedTodos = () => {
    try {
      todos
        .filter(todo => todo.completed)
        .map(async (completedTodo) => {
          await removeTodo(completedTodo.id);
        });
    } catch {
      setErrorType(ErrorType.DELETE_UNABLE);
    }
  };

  const updateTodo = async (id: number, newValues: TodoUpdate) => {
    try {
      const updatedTodo: Todo = await patchTodo(id, newValues);

      const indexOfTodo: number = todos.findIndex(
        (todo: Todo) => todo.id === id,
      );

      setTodos((prevTodos) => [
        ...prevTodos.slice(0, indexOfTodo),
        updatedTodo,
        ...prevTodos.slice(indexOfTodo + 1),
      ]);
    } catch {
      setErrorType(ErrorType.UPDATE_UNABLE);
    }
  };

  const updateAll = () => {
    try {
      const newStatus: boolean = todosInfo.countOfActive > 0;

      todos.map(async (todo) => {
        await updateTodo(todo.id, { completed: newStatus });
      });
    } catch {
      setErrorType(ErrorType.UPDATE_UNABLE);
    }
  };

  const handleFilterType = (type: FilterType): void => {
    setFilterType(type as FilterType);
  };

  const removeError = () => {
    setErrorType(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          countOfActive={todosInfo.countOfActive}
          addTodo={addTodo}
          setErrorType={setErrorType}
          updateAll={updateAll}
        />

        {todosInfo.length !== 0
          && (
            <>
              <TodoList
                todos={visibleTodos}
                removeTodo={removeTodo}
                tempTodo={tempTodo}
                updateTodo={updateTodo}
              />
              <Footer
                filterType={filterType}
                handleFilterType={handleFilterType}
                hasCompleted={todosInfo.hasCompleted}
                countOfActive={todosInfo.countOfActive}
                removeCompletedTodos={removeCompletedTodos}
              />
            </>
          )}
      </div>

      {errorType
        && (
          <ErrorMessage
            errorType={errorType}
            removeError={removeError}
          />
        )}
    </div>
  );
};
