import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorModal } from './components/ErrorModal/ErrorModal';
import { LoadContext } from './Context/LoadContext';
import { UserWarning } from './UserWarning';
import { FilterType, ErrorType } from './typedefs';
import { Todo } from './components/TodoItem/Todo';
import {
  addTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { getFilteredTodos } from './helpers/helpers';
import { useFilteredTodos } from './hooks/useFilteredTodos';

const USER_ID = 6748;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [unableField, setUnableField] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  const {
    activeTodos,
    completedTodos,
  } = useFilteredTodos({ todos });

  const showError = (errorType: ErrorType) => {
    setError(errorType);
    setTimeout(() => setError(ErrorType.NONE), 3000);
  };

  const handleCloseError = useCallback(() => {
    setError(ErrorType.NONE);
  }, []);

  const fetchTodos = useCallback(async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch {
      showError(ErrorType.LOAD);
      setTodos([]);
    }
  }, []);

  const addNewTodo = useCallback(
    async (title: string) => {
      if (!title.trim()) {
        showError(ErrorType.TITLE);

        return;
      }

      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      try {
        setUnableField(true);
        setTempTodo({
          id: 0,
          ...newTodo,
        });

        const todo = await addTodo(newTodo);

        setTodos(prevTodos => [...prevTodos, todo]);
      } catch {
        showError(ErrorType.ADD);
      } finally {
        setUnableField(false);
        setTempTodo(null);
      }
    }, [],
  );

  const deleteTodo = useCallback(
    async (id: number) => {
      try {
        setLoadingTodos(prevTodos => [...prevTodos, id]);

        await removeTodo(id);
        fetchTodos();
      } catch {
        showError(ErrorType.DELETE);
      } finally {
        setLoadingTodos([0]);
      }
    }, [],
  );

  const handleDeleteCompleted = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [filterType, todos]);

  const updateTodoStatus = useCallback(
    async (
      id: number,
      property: Partial<Todo>,
    ) => {
      try {
        setLoadingTodos(prevTodos => [...prevTodos, id]);

        await updateTodo(id, property);
        fetchTodos();
      } catch {
        showError(ErrorType.UPDATE);
      } finally {
        setLoadingTodos([0]);
      }
    }, [],
  );

  const updateAllStatus = useCallback(() => {
    activeTodos.forEach(todo => {
      updateTodoStatus(todo.id, { completed: true });
    });

    if (!activeTodos.length) {
      completedTodos.forEach(todo => {
        updateTodoStatus(todo.id, { completed: false });
      });
    }
  }, [activeTodos, completedTodos]);

  useEffect(() => {
    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <LoadContext.Provider value={loadingTodos}>
      <div className="todoapp">
        <h1 className="todoapp__title">
          todos
        </h1>

        <div className="todoapp__content">
          <Header
            onAdd={addNewTodo}
            disabled={unableField}
            activeTodos={activeTodos.length}
            onUpdateAllStatus={updateAllStatus}
          />

          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDelete={deleteTodo}
            onChange={updateTodoStatus}
          />

          {todos.length > 0 && (
            <Footer
              filterType={filterType}
              onChangeFilterType={setFilterType}
              onRemoveCompleted={handleDeleteCompleted}
              activeTodos={activeTodos}
              completedTodos={completedTodos}
            />
          )}
        </div>

        {error && (
          <ErrorModal
            error={error}
            onClose={handleCloseError}
          />
        )}
      </div>
    </LoadContext.Provider>
  );
};
