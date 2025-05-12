import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import * as api from './api/todos';
import { Todo } from './types/Todo';
import { TypeFilter } from './types/TypeFilter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotifications } from './components/ErrorNotifications';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoInputValue, setTodoInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState<TypeFilter>(TypeFilter.All);

  const todoInputRef = useRef<HTMLInputElement>(null);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const filteredTodos = useMemo(() => {
    switch (activeFilter) {
      case TypeFilter.Active:
        return activeTodos;

      case TypeFilter.Completed:
        return completedTodos;

      default:
        return todos;
    }
  }, [activeFilter, activeTodos, completedTodos, todos]);

  const showTemporaryError = useCallback(
    (message: string, durationMs = 3000) => {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), durationMs);
    },
    [],
  );

  const focusInput = useCallback(() => {
    todoInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      focusInput();
    }
  }, [isLoading, focusInput]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosData = await api.getTodos();

        setTodos(todosData);
      } catch (error) {
        showTemporaryError('Unable to load todos');
      }
    };

    loadTodos();
  }, [showTemporaryError]);

  const addTodo = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const title = todoInputValue.trim();

      if (!title) {
        showTemporaryError('Title should not be empty');

        return;
      }

      setIsLoading(true);

      const newTodoData = {
        userId: api.USER_ID,
        title,
        completed: false,
      };

      setTempTodo({ id: 0, ...newTodoData });

      try {
        const createdTodo = await api.createTodo(newTodoData);

        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTodoInputValue('');
      } catch (error) {
        showTemporaryError('Unable to add a todo');
      } finally {
        setTempTodo(null);
        setIsLoading(false);
      }
    },
    [todoInputValue, showTemporaryError],
  );

  const deleteTodos = useCallback(
    async (todoIds: number[]) => {
      if (!todoIds.length) {
        return;
      }

      setProcessingTodoIds(current => [...current, ...todoIds]);

      try {
        await Promise.all(
          todoIds.map(async id => {
            try {
              await api.deleteTodo(id);

              setTodos(currentTodos =>
                currentTodos.filter(todo => todo.id !== id),
              );
            } catch (error) {
              showTemporaryError('Unable to delete a todo');
            }
          }),
        );
      } finally {
        setProcessingTodoIds(current =>
          current.filter(id => !todoIds.includes(id)),
        );

        focusInput();
      }
    },
    [showTemporaryError, focusInput],
  );

  const updateTodos = useCallback(
    async (todosToUpdate: Todo[]): Promise<boolean[]> => {
      if (!todosToUpdate.length) {
        return [];
      }

      const todoIds = todosToUpdate.map(todo => todo.id);

      setProcessingTodoIds(current => [...current, ...todoIds]);

      try {
        const updateResults = await Promise.all(
          todosToUpdate.map(async updatedTodo => {
            try {
              await api.updateTodo(updatedTodo);

              setTodos(currentTodos =>
                currentTodos.map(todo =>
                  todo.id === updatedTodo.id ? updatedTodo : todo,
                ),
              );

              return true;
            } catch (error) {
              showTemporaryError('Unable to update a todo');

              return false;
            }
          }),
        );

        return updateResults;
      } finally {
        setProcessingTodoIds(current =>
          current.filter(id => !todoIds.includes(id)),
        );
      }
    },
    [showTemporaryError],
  );

  const toggleTodos = useCallback(
    async (todosToToggle: Todo[]) => {
      const toggledTodos = todosToToggle.map(todo => ({
        ...todo,
        completed: !todo.completed,
      }));

      return updateTodos(toggledTodos);
    },
    [updateTodos],
  );

  const toggleAllTodos = useCallback(
    async (shouldComplete: boolean) => {
      const todosToToggle = shouldComplete ? activeTodos : completedTodos;

      if (!todosToToggle.length) {
        return [];
      }

      const todosWithUpdatedStatus = todosToToggle.map(todo => ({
        ...todo,
        completed: shouldComplete,
      }));

      return updateTodos(todosWithUpdatedStatus);
    },
    [activeTodos, completedTodos, updateTodos],
  );

  const clearCompletedTodos = useCallback(() => {
    const completedTodoIds = completedTodos.map(todo => todo.id);

    return deleteTodos(completedTodoIds);
  }, [completedTodos, deleteTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          todoInputValue={todoInputValue}
          setTodoInputValue={setTodoInputValue}
          addTodo={addTodo}
          isLoading={isLoading}
          toggleAllTodos={toggleAllTodos}
          inputRef={todoInputRef}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodos={deleteTodos}
          tempTodo={tempTodo}
          isLoading={isLoading}
          processingTodoIds={processingTodoIds}
          toggleTodos={toggleTodos}
          updateTodos={updateTodos}
          focusInput={focusInput}
        />

        {todos.length > 0 && (
          <TodoFooter
            currentFilter={activeFilter}
            setCurrentFilter={setActiveFilter}
            activeCount={activeTodos.length}
            hasCompleted={completedTodos.length > 0}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotifications
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
