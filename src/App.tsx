/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Header } from './components/header';
import { Main } from './components/main';
import { Footer } from './components/footer';
import { Notification } from './components/notification';
import { Todo } from './types/Todo';
import { USER_ID } from './utils/constants';
import { Filter } from './types/Filter';
import {
  getTodos,
  deleteTodo,
  updateTodoCompleted,
  updateTodoTitle,
} from './api/todos';

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>(Filter.ALL);
  const [loading, setIsLoading] = useState(false);
  const [loadingID, setLoadingID] = useState(0);
  const [comletedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [uncomletedTodoCount, setUncomletedTodoCount] = useState<number>(0);

  const visibleTodos = useMemo(() => {
    let filteredTodos: Todo[] = todos;

    if (filter === Filter.ACTIVE) {
      filteredTodos = todos.filter(todo => !todo.completed);
    }

    if (filter === Filter.COMPLETED) {
      filteredTodos = todos.filter(todo => todo.completed);
    }

    return filteredTodos || [];
  }, [filter, todos]);

  const loadTodos = useCallback(async () => {
    try {
      await getTodos(USER_ID)
        .then(res => setTodos(res));
    } catch {
      setError('can not load todo');
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingID(todoId);
      setIsLoading(true);
      await deleteTodo(todoId);
      await loadTodos();
    } catch {
      setError('can not delete todo');
    }

    setIsLoading(false);
  }, [loadTodos]);

  const handleEditTodo = useCallback(async (newTitle: string, id: number) => {
    if (!newTitle) {
      handleDeleteTodo(id);

      return;
    }

    setLoadingID(id);
    setIsLoading(true);
    try {
      await updateTodoTitle(id, {
        title: newTitle,
      });
    } catch {
      setError('can not edit todo');
    }

    setIsLoading(false);
    loadTodos();
  }, [handleDeleteTodo, loadTodos]);

  const handleUpdateTodoIsCompleted = useCallback(async (
    id: number,
    complitedCurrVal: boolean,
  ) => {
    try {
      setLoadingID(id);
      setIsLoading(true);
      await updateTodoCompleted(id, {
        completed: !complitedCurrVal,
      });
      await loadTodos();
    } catch {
      setError('can not update todo');
    }

    setIsLoading(false);
  }, [loadTodos]);

  const handleToggleAllComplited = useCallback(() => {
    const todosCurrValue = todos.every(todo => todo.completed === true);

    todos.forEach(todo => {
      handleUpdateTodoIsCompleted(todo.id, todosCurrValue);
    });
  }, [handleUpdateTodoIsCompleted, todos]);

  const handleSetTempTodo = useCallback((todo: Todo | null) => {
    setTempTodo(todo);
  }, []);

  const handleSetError = useCallback((errVal: string) => {
    setError(errVal);
  }, []);

  const HandleSelectFilter = useCallback((filterValue: string) => {
    setFilter(filterValue);
  }, []);

  const handleClearComplitedTodos = useCallback(() => {
    comletedTodos.map(todo => handleDeleteTodo(todo.id));
  }, [comletedTodos, handleDeleteTodo]);

  const updateTodos = useCallback((todo: Todo) => {
    setTodos(prevTodos => [...prevTodos as Todo[], todo]);
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    setCompletedTodos(todos.filter(todoa => todoa.completed));
    setUncomletedTodoCount(todos.filter(todo => !todo.completed).length);
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={handleSetError}
          handleSetTempTodo={handleSetTempTodo}
          userId={USER_ID}
          updateTodos={updateTodos}
          onToggle={handleToggleAllComplited}
          todos={todos}
        />
        {todos && (
          <>
            <Main
              todos={visibleTodos}
              tempTodo={tempTodo}
              handleDeleteTodo={handleDeleteTodo}
              loading={loading}
              loadingID={loadingID}
              handleUpdateTodoIsCompleted={handleUpdateTodoIsCompleted}
              editTodo={handleEditTodo}
            />

            <Footer
              setFilter={HandleSelectFilter}
              selectedFilter={filter}
              comletedTodos={comletedTodos}
              clearCompletedTodos={handleClearComplitedTodos}
              uncomletedTodoCount={uncomletedTodoCount}
            />
          </>
        )}
      </div>
      {error
      && (
        <Notification
          setError={handleSetError}
          errorText={error}
        />
      )}
    </div>
  );
};
