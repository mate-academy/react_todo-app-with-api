/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ERRORS } from './utils/errors';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterStatus } from './types/FilterStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ERRORS>(ERRORS.Empty);

  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const todoInputRef = useRef<HTMLInputElement>(null);
  const isAllCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );

  const showError = useCallback((message: ERRORS) => {
    setErrorMessage(message);
  }, []);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ERRORS.Load));
  }, [showError]);

  function filterTodos(allTodos: Todo[], status: FilterStatus): Todo[] {
    switch (status) {
      case FilterStatus.All:
        return allTodos;
      case FilterStatus.Active:
        return allTodos.filter(todo => !todo.completed);
      case FilterStatus.Completed:
        return allTodos.filter(todo => todo.completed);
      default:
        return allTodos;
    }
  }

  const visibleTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  const shouldShowList = useMemo(
    () => todos.length > 0 || !!tempTodo,
    [todos, tempTodo],
  );

  const handleAddTodo = async (title: string): Promise<boolean> => {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      showError(ERRORS.Title);

      return false;
    }

    setErrorMessage(ERRORS.Empty);
    setIsLoading(true);

    const newTodo: Omit<Todo, 'id'> = {
      userId: todoService.USER_ID,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const createdTodo = await todoService.createTodo(newTodo);

      setTodos(prev => [...prev, createdTodo]);

      return true;
    } catch {
      showError(ERRORS.Add);

      return false;
    } finally {
      setTempTodo(null);
      setIsLoading(false);
      todoInputRef.current?.focus();
    }
  };

  const handleDeleteTodo = useCallback(
    async (todoId: number) => {
      setErrorMessage(ERRORS.Empty);

      setProcessingIds(prev => [...prev, todoId]);

      try {
        await todoService.deleteTodo(todoId);
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      } catch {
        showError(ERRORS.Delete);
      } finally {
        setProcessingIds(prev => prev.filter(id => id !== todoId));
        todoInputRef.current?.focus();
      }
    },
    [showError],
  );

  const handleUpdateTodo = useCallback(
    async (updatedTodo: Todo): Promise<void> => {
      setProcessingIds(prev => [...prev, updatedTodo.id]);
      setErrorMessage(ERRORS.Empty);

      try {
        const newTodo = await todoService.updateTodo(updatedTodo);

        setTodos(current =>
          current.map(todo => (todo.id === newTodo.id ? newTodo : todo)),
        );
      } catch {
        showError(ERRORS.Update);
        throw new Error();
      } finally {
        setProcessingIds(prev => prev.filter(id => id !== updatedTodo.id));
      }
    },
    [showError],
  );

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const handleToggleAll = async () => {
    const targetStatus = !isAllCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          handleUpdateTodo({ ...todo, completed: targetStatus }),
        ),
      );
    } catch {}
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onAdd={handleAddTodo}
          isLoading={isLoading}
          onError={showError}
          inputRef={todoInputRef}
          isAllCompleted={isAllCompleted}
          onToggleAll={handleToggleAll}
          todosLength={todos.length}
        />
        {shouldShowList && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
              processingIds={processingIds}
            />
            <Footer
              currentFilter={filter}
              onFilterChange={setFilter}
              todos={todos}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>
      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(ERRORS.Empty)}
      />
    </div>
  );
};
