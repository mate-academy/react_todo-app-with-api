import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import {
  getTodos,
  postTodo,
  deleteTodo,
  USER_ID,
  getFilteredTodos,
  updateTodo,
} from './api/todos';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { Notifications } from './Components/Notifications';
import { FilterType } from './types/FilterType';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedTodos, setProcessedTodos] = useState<number[]>([]);

  const visibleTodos = useMemo(() => (
    getFilteredTodos(todos, filterType)
  ), [todos, filterType]);

  const activeTodos = useMemo(() => (
    getFilteredTodos(todos, FilterType.ACTIVE)
  ), [todos]);

  const completedTodos = useMemo(() => (
    getFilteredTodos(todos, FilterType.COMPLETED)
  ), [todos]);

  const loadTodos = useCallback(async () => {
    setError(null);

    if (USER_ID) {
      try {
        const todoList = await getTodos(USER_ID);

        setTodos(todoList);
      } catch {
        setError(ErrorTypes.LOAD);
      }
    }
  }, [USER_ID]);

  const handleAddTodo = async (newTitle: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!newTitle.trim()) {
        setError(ErrorTypes.INPUT);
        setIsLoading(false);

        return;
      }

      if (USER_ID) {
        setTempTodo({
          id: 0,
          userId: USER_ID,
          title: newTitle,
          completed: false,
        });

        const newTodo = await postTodo({
          userId: USER_ID,
          title: newTitle,
          completed: false,
        });

        setTodos(prevTodo => [...prevTodo, newTodo]);
      }
    } catch {
      setError(ErrorTypes.ADD);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const handleUpdateTodo = useCallback(async (todo: Todo) => {
    setError(null);
    setProcessedTodos(prevTodos => [...prevTodos, todo.id]);

    try {
      const updatedTodo = { ...todo, completed: !todo.completed };

      await updateTodo(todo.id, updatedTodo);
    } catch {
      setError(ErrorTypes.UPDATE);
    } finally {
      setIsLoading(false);
      setError(null);
      await loadTodos();
      setProcessedTodos([]);
    }
  }, []);

  const handleUpdateTitle = useCallback(
    async (todo: Todo, newTitle: string) => {
      try {
        setProcessedTodos(prevTodos => [...prevTodos, todo.id]);
        const updatedTitle = { ...todo, title: newTitle };
        const updatedTodo = await updateTodo(todo.id, updatedTitle);

        await loadTodos();
        setProcessedTodos(prevTodos => prevTodos
          .filter(todoId => todoId !== updatedTodo.id));
      } catch {
        setError(ErrorTypes.UPDATE);
      }
    }, [processedTodos],
  );

  const handleDeleteTodo = useCallback(
    async (todoId: number) => {
      setProcessedTodos(prevTodos => [...prevTodos, todoId]);
      setError(null);

      try {
        await deleteTodo(todoId);

        setTodos(allTodos => allTodos.filter(todo => todo.id !== todoId));
      } catch {
        setError(ErrorTypes.DELETE);
      } finally {
        setProcessedTodos(prevTodos => prevTodos
          .filter(id => id !== todoId));
      }
    }, [processedTodos],
  );

  const toggleAllTodos = () => {
    const allTogglers = completedTodos.length !== todos.length
      ? activeTodos
      : todos;

    allTogglers.forEach(todo => {
      handleUpdateTodo({ ...todo, completed: todo.completed });
    });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          createdTodo={handleAddTodo}
          todos={todos}
          completedTodos={completedTodos}
          isLoading={isLoading}
          onToggle={toggleAllTodos}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          processedTodos={processedTodos}
          onDelete={handleDeleteTodo}
          onUpdateTodo={handleUpdateTodo}
          onUpdateTitle={handleUpdateTitle}
        />

        {!!todos.length && (
          <Footer
            todos={visibleTodos}
            filterType={filterType}
            setFilterType={setFilterType}
            completedTodos={completedTodos}
            onDelete={handleDeleteTodo}
          />
        )}
      </div>

      {error && (
        <Notifications
          setError={setError}
          error={error}
        />
      )}
    </div>
  );
};
