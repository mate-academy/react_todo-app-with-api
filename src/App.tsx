import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TodoUpdate, Todo } from './types/Todo';
import { ErrorType, FilterType } from './types/HelperTypes';
import { getFilteredTodos } from './Helper';
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
import { LoginForm } from './components/LoginForm';
import { TodoContext } from './TodoContext';

const initialTodo: Todo = {
  id: 0,
  userId: 10923,
  completed: false,
  title: '',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const {
    addTodoIdOnLoad,
    removeTodoIdAfterLoading,
    userId,
  } = useContext(TodoContext);

  const loadTodos = useCallback(async () => {
    setErrorType(null);

    try {
      if (userId) {
        const loadedTodos: Todo[] = await getTodos(userId);

        setTodos(loadedTodos);
      }
    } catch {
      setErrorType(ErrorType.DATALOADING);
    }
  }, [userId]);

  useEffect(() => {
    loadTodos();
  }, [userId]);

  const visibleTodos: Todo[] = useMemo(() => {
    const filteredTodos = getFilteredTodos(todos, filterType);

    return filteredTodos;
  }, [todos, filterType]);

  const addTodo = useCallback(async (title: string) => {
    try {
      setTempTodo({
        ...initialTodo,
        title,
      });

      if (userId) {
        const newTodo: Todo = await postTodo(title, userId);

        setTodos((prevTodos) => [
          ...prevTodos,
          newTodo,
        ]);
      }
    } catch {
      setErrorType(ErrorType.ADD_UNABLE);
    } finally {
      setTempTodo(null);
    }
  }, [userId]);

  const countOfActive = getFilteredTodos(
    todos, FilterType.ACTIVE,
  ).length;

  const hasCompleted = todos.some(todo => todo?.completed);

  const removeTodo = useCallback(async (id: number) => {
    try {
      addTodoIdOnLoad(id);

      const removedTodo = await deleteTodo(id);

      if (removedTodo) {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
        removeTodoIdAfterLoading(id);
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
      addTodoIdOnLoad(id);
      const updatedTodo: Todo = await patchTodo(id, newValues);

      const indexOfTodo: number = todos.findIndex(
        (todo: Todo) => todo.id === id,
      );

      setTodos((prevTodos) => [
        ...prevTodos.slice(0, indexOfTodo),
        updatedTodo,
        ...prevTodos.slice(indexOfTodo + 1),
      ]);
      removeTodoIdAfterLoading(id);
    } catch {
      setErrorType(ErrorType.UPDATE_UNABLE);
    }
  };

  const updateAll = () => {
    try {
      const newStatus: boolean = countOfActive > 0;

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

  if (!userId) {
    return (
      <>
        <LoginForm setErrorType={setErrorType} />
        {errorType
        && (
          <ErrorMessage
            errorType={errorType}
            removeError={removeError}
          />
        )}
      </>
    );
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          countOfActive={countOfActive}
          addTodo={addTodo}
          setErrorType={setErrorType}
          updateAll={updateAll}
        />

        {todos.length !== 0
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
                hasCompleted={hasCompleted}
                countOfActive={countOfActive}
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
