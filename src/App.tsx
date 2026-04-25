/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import {
  createTodo,
  deleteTodo as deleteTodoRequest,
  getTodos,
  updateTodo as updateTodoRequest,
} from './api/todos';
import { ERROR_MESSAGES, ERROR_HIDE_DELAY, FILTERS } from './constants';
import type { FilterStatus, Todo, TodoUpdate } from './types/Todo';
import { UserWarning } from './UserWarning';

const getUserId = () => {
  const savedUser = localStorage.getItem('user');

  if (!savedUser) {
    return 0;
  }

  try {
    const parsedUser = JSON.parse(savedUser);

    return Number(parsedUser.id) || 0;
  } catch {
    return 0;
  }
};

const getVisibleTodos = (todos: Todo[], filter: FilterStatus) => {
  switch (filter) {
    case FILTERS.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case FILTERS.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

const getFilterFromHash = (): FilterStatus => {
  const hash = window.location.hash.replace(/^#\/?/, '');

  switch (hash) {
    case FILTERS.ACTIVE:
      return FILTERS.ACTIVE;

    case FILTERS.COMPLETED:
      return FILTERS.COMPLETED;

    default:
      return FILTERS.ALL;
  }
};

export const App: React.FC = () => {
  const userId = getUserId();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(getFilterFromHash);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const errorTimeoutId = useRef<number | null>(null);
  const tempTodoId = useRef(0);

  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, filter),
    [filter, todos],
  );
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);
  const hasTodos = todos.length > 0;
  const areAllTodosCompleted = hasTodos && activeTodosCount === 0;

  const clearError = useCallback(() => {
    if (errorTimeoutId.current) {
      window.clearTimeout(errorTimeoutId.current);
      errorTimeoutId.current = null;
    }

    setErrorMessage('');
  }, []);

  const showError = useCallback(
    (message: string) => {
      clearError();
      setErrorMessage(message);
      errorTimeoutId.current = window.setTimeout(() => {
        setErrorMessage('');
        errorTimeoutId.current = null;
      }, ERROR_HIDE_DELAY);
    },
    [clearError],
  );

  const focusNewTodoField = () => {
    newTodoFieldRef.current?.focus();
  };

  const addLoadingTodo = (todoId: number) => {
    setLoadingTodoIds(currentIds =>
      currentIds.includes(todoId) ? currentIds : [...currentIds, todoId],
    );
  };

  const removeLoadingTodo = (todoId: number) => {
    setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
  };

  const closeTodoEditor = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const replaceTodo = (updatedTodo: Todo) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === updatedTodo.id ? updatedTodo : todo,
      ),
    );
  };

  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(userId);

        setTodos(loadedTodos);
      } catch {
        showError(ERROR_MESSAGES.load);
      }
    };

    void loadTodos();
  }, [showError, userId]);

  useEffect(() => {
    newTodoFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setFilter(getFilterFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(
    () => () => {
      clearError();
    },
    [clearError],
  );

  const handleCreateTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      showError(ERROR_MESSAGES.emptyTitle);
      focusNewTodoField();

      return;
    }

    tempTodoId.current -= 1;

    const pendingTodo: Todo = {
      id: tempTodoId.current,
      userId,
      title: trimmedTitle,
      completed: false,
    };

    setIsCreating(true);
    setTempTodo(pendingTodo);

    try {
      const createdTodo = await createTodo({
        userId,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setNewTitle('');
      setTempTodo(null);
    } catch {
      setTempTodo(null);
      showError(ERROR_MESSAGES.add);
    } finally {
      setIsCreating(false);
      focusNewTodoField();
    }
  };

  const handleDeleteTodo = async (
    todoId: number,
    options: {
      preserveEditingOnFail?: boolean;
      focusOnSuccess?: boolean;
    } = {},
  ) => {
    clearError();
    addLoadingTodo(todoId);

    try {
      await deleteTodoRequest(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      if (editingTodoId === todoId) {
        closeTodoEditor();
      }

      if (options.focusOnSuccess !== false) {
        focusNewTodoField();
      }

      return true;
    } catch {
      showError(ERROR_MESSAGES.delete);

      if (!options.preserveEditingOnFail && editingTodoId === todoId) {
        closeTodoEditor();
      }

      return false;
    } finally {
      removeLoadingTodo(todoId);
    }
  };

  const handleUpdateTodo = async (todoId: number, changes: TodoUpdate) => {
    clearError();
    addLoadingTodo(todoId);

    try {
      const updatedTodo = await updateTodoRequest(todoId, changes);

      replaceTodo(updatedTodo);

      return updatedTodo;
    } catch {
      showError(ERROR_MESSAGES.update);

      return null;
    } finally {
      removeLoadingTodo(todoId);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    await handleUpdateTodo(todo.id, { completed: !todo.completed });
  };

  const handleClearCompleted = async () => {
    clearError();

    const completedTodoIds = completedTodos.map(todo => todo.id);

    if (!completedTodoIds.length) {
      return;
    }

    setLoadingTodoIds(currentIds => [
      ...currentIds,
      ...completedTodoIds.filter(id => !currentIds.includes(id)),
    ]);

    const results = await Promise.allSettled(
      completedTodos.map(async todo => {
        await deleteTodoRequest(todo.id);

        return todo.id;
      }),
    );

    const deletedTodoIds = results
      .filter(
        (result): result is PromiseFulfilledResult<number> =>
          result.status === 'fulfilled',
      )
      .map(result => result.value);

    const hasErrors = results.some(result => result.status === 'rejected');

    if (deletedTodoIds.length) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => !deletedTodoIds.includes(todo.id)),
      );

      if (editingTodoId !== null && deletedTodoIds.includes(editingTodoId)) {
        closeTodoEditor();
      }
    }

    completedTodoIds.forEach(removeLoadingTodo);

    if (hasErrors) {
      showError(ERROR_MESSAGES.delete);
    }

    focusNewTodoField();
  };

  const handleToggleAll = async () => {
    clearError();

    const nextCompletedState = !areAllTodosCompleted;
    const todosToToggle = todos.filter(
      todo => todo.completed !== nextCompletedState,
    );

    if (!todosToToggle.length) {
      return;
    }

    const todoIdsToToggle = todosToToggle.map(todo => todo.id);

    setLoadingTodoIds(currentIds => [
      ...currentIds,
      ...todoIdsToToggle.filter(id => !currentIds.includes(id)),
    ]);

    const results = await Promise.allSettled(
      todosToToggle.map(async todo =>
        updateTodoRequest(todo.id, {
          completed: nextCompletedState,
        }),
      ),
    );

    const updatedTodos = results.filter(
      (result): result is PromiseFulfilledResult<Todo> =>
        result.status === 'fulfilled',
    );
    const hasErrors = results.some(result => result.status === 'rejected');

    if (updatedTodos.length) {
      setTodos(currentTodos =>
        currentTodos.map(todo => {
          const updatedTodo = updatedTodos.find(
            result => result.value.id === todo.id,
          )?.value;

          return updatedTodo || todo;
        }),
      );
    }

    todoIdsToToggle.forEach(removeLoadingTodo);

    if (hasErrors) {
      showError(ERROR_MESSAGES.update);
    }
  };

  const handleStartEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleSubmitEditing = async (todo: Todo) => {
    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      closeTodoEditor();

      return true;
    }

    if (!trimmedTitle) {
      const isDeleted = await handleDeleteTodo(todo.id, {
        preserveEditingOnFail: true,
      });

      if (isDeleted) {
        closeTodoEditor();
      }

      return isDeleted;
    }

    const updatedTodo = await handleUpdateTodo(todo.id, {
      title: trimmedTitle,
    });

    if (!updatedTodo) {
      return false;
    }

    closeTodoEditor();

    return true;
  };

  if (!userId) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={hasTodos}
          isCreating={isCreating}
          newTitle={newTitle}
          areAllTodosCompleted={areAllTodosCompleted}
          onCreateTodo={handleCreateTodo}
          onToggleAll={handleToggleAll}
          onNewTitleChange={setNewTitle}
          newTodoFieldRef={newTodoFieldRef}
        />

        {(hasTodos || tempTodo) && (
          <section className="todoapp__main">
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              filter={filter}
              loadingTodoIds={loadingTodoIds}
              editingTodoId={editingTodoId}
              editingTitle={editingTitle}
              onDeleteTodo={handleDeleteTodo}
              onToggleTodo={handleToggleTodo}
              onStartEditing={handleStartEditing}
              onCancelEditing={closeTodoEditor}
              onEditingTitleChange={setEditingTitle}
              onSubmitEditing={handleSubmitEditing}
            />
          </section>
        )}

        {hasTodos && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodos.length}
            currentFilter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onClose={clearError} />
    </div>
  );
};
