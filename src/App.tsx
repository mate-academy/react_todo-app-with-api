import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorModal } from './components/ErrorModal';
import { LoadContext } from './Context/LoadContext';
import { UserWarning } from './UserWarning';
import { FilterType, ErrorType } from './typedefs';
import { Todo } from './types/Todo';
import {
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { getFilteredTodos } from './helpers';
import { useFilteredTodos } from './hooks/useFilteredTodos';
import { useError } from './hooks/useError';
import { usePost } from './hooks/usePost';

const USER_ID = 6993;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [loadingIds, setloadingIds] = useState([0]);

  const {
    activeTodos,
    completedTodos,
  } = useFilteredTodos({ todos });

  const {
    error,
    showError,
    handleCloseError,
  } = useError();

  const {
    tempTodo,
    isInputDisabled,
    addNewTodo,
  } = usePost({ USER_ID, setTodos, showError });

  const fetchTodos = useCallback(async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch {
      showError(ErrorType.LOAD);
    }
  }, []);

  const deleteTodo = useCallback(
    async (id: number) => {
      try {
        setloadingIds(prevTodos => [...prevTodos, id]);

        await removeTodo(id);
        fetchTodos();
      } catch {
        showError(ErrorType.DELETE);
      } finally {
        setloadingIds([0]);
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
        setloadingIds(prevTodos => [...prevTodos, id]);

        await updateTodo(id, property);
        fetchTodos();
      } catch {
        showError(ErrorType.UPDATE);
      } finally {
        setloadingIds([0]);
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
    <LoadContext.Provider value={loadingIds}>
      <div className="todoapp">
        <h1 className="todoapp__title">
          todos
        </h1>

        <div className="todoapp__content">
          <Header
            onAdd={addNewTodo}
            disabled={isInputDisabled}
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
