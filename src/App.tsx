import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  FormEvent,
  useCallback,
} from 'react';
import {
  getTodos,
  createTodo,
  deleteTodo,
  patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { FilterType } from './types/Filter';
import TodoPanel from './components/TodoPanel';
import TodoList from './components/TodoList';
import ErrorNotification from './components/ErrorNotification';
import Filter from './components/Filter';
import { AuthContext } from './components/Auth/AuthContext';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [completedIds, setCompletedIds] = useState<number[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);

  useEffect(() => {
    getTodos(user?.id || 0)
      .then(allTodos => setTodos(allTodos.reverse()))
      .catch(() => setError(Error.Connect));
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterType.Active:
          return !todo.completed;

        case FilterType.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filterType]);

  const activeTodos = useMemo(() => todos
    .filter(todo => !todo.completed), [todos]);
  const completedTodos = useMemo(() => todos
    .filter(todo => todo.completed), [todos]);

  const handleAddTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.Title);
      setTitle('');

      return;
    }

    const newTodo = {
      id: Math.max(0, ...todos.map(({ id }) => id)) + 1,
      userId: user?.id || 0,
      completed: false,
      title,
    };

    setTodos(prevState => [newTodo, ...prevState]);
    setSelectedId(newTodo.id);
    setIsLoading(true);
    setTitle('');

    try {
      await createTodo(newTodo);
    } catch {
      setError(Error.Add);
    } finally {
      setIsFocused(prevState => !prevState);
      setSelectedId(null);
      setIsLoading(false);
    }
  }, [title]);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    setIsLoading(true);
    setSelectedId(todoId);

    try {
      await deleteTodo(todoId);

      setTodos(prevState => prevState.filter(todo => todo.id !== todoId));
    } catch {
      setError(Error.Delete);
    } finally {
      setIsLoading(false);
      setSelectedId(null);
    }
  }, []);

  const handleUpdateTodo = useCallback(
    async (todoId: number, data: Partial<Todo>) => {
      setIsLoading(true);
      setSelectedId(todoId);

      try {
        const newTodo = await patchTodo(todoId, data);

        setTodos(prevState => prevState.map(todo => (
          todo.id === todoId
            ? newTodo
            : todo
        )));
      } catch {
        setError(Error.Update);
      } finally {
        setIsLoading(false);
        setSelectedId(null);
      }
    }, [],
  );

  const handleToggleAll = useCallback(async () => {
    setIsLoading(true);
    setToggleLoader(true);

    try {
      let newTodos;

      if (activeTodos.length) {
        newTodos = await Promise.all(todos.map(
          todo => patchTodo(todo.id, { completed: true }),
        ));
      } else {
        newTodos = await Promise.all(todos.map(
          todo => patchTodo(todo.id, { completed: false }),
        ));
      }

      setTodos(newTodos);
    } catch {
      setError(Error.Update);
    } finally {
      setIsLoading(false);
      setToggleLoader(false);
    }
  }, [todos]);

  const clearCompleted = useCallback(async () => {
    setIsLoading(true);
    setCompletedIds(
      completedTodos.map(todo => todo.id),
    );

    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
      setTodos(activeTodos);
    } finally {
      setIsLoading(false);
      setCompletedIds(null);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoPanel
          todos={visibleTodos}
          addTodo={handleAddTodo}
          toggleAll={handleToggleAll}
          title={title}
          setTitle={setTitle}
          isLoading={isLoading}
          toggleLoader={toggleLoader}
          isFocused={isFocused}
        />

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            removeTodo={handleRemoveTodo}
            onUpdate={handleUpdateTodo}
            isLoading={isLoading}
            selectedId={selectedId}
            toggleLoader={toggleLoader}
            completedIds={completedIds}
          />
        )}

        {todos.length > 0 && (
          <Filter
            filterType={filterType}
            setFilterType={setFilterType}
            clearCompleted={clearCompleted}
            activeTodos={activeTodos}
            completedTodos={completedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorDetected={error}
        setError={setError}
      />
    </div>
  );
};
