import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Filter } from './types/Filter';
import { TempTodo } from './types/TempTodo';
import { Todo } from './types/Todo';

const TEMP_TODO_ID = 0;

const getFilterFromHash = (): Filter => {
  switch (window.location.hash) {
    case '#/active':
      return 'active';

    case '#/completed':
      return 'completed';

    default:
      return 'all';
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(getFilterFromHash);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const newTodoField = useRef<HTMLInputElement>(null);
  const errorTimerId = useRef<number | null>(null);
  const editingCanceled = useRef(false);

  const hideError = React.useCallback(() => {
    setErrorMessage('');

    if (errorTimerId.current) {
      window.clearTimeout(errorTimerId.current);
      errorTimerId.current = null;
    }
  }, []);

  const showError = React.useCallback(
    (message: string) => {
      hideError();
      setErrorMessage(message);

      errorTimerId.current = window.setTimeout(() => {
        setErrorMessage('');
        errorTimerId.current = null;
      }, 3000);
    },
    [hideError],
  );

  const markTodoAsLoading = (todoId: number) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);
  };

  const unmarkTodoAsLoading = (todoId: number) => {
    setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
  };

  useEffect(() => {
    const handleHashChange = () => setFilter(getFilterFromHash());

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    hideError();

    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));

    return () => {
      if (errorTimerId.current) {
        window.clearTimeout(errorTimerId.current);
      }
    };
  }, [hideError, showError]);

  useEffect(() => {
    newTodoField.current?.focus();
  }, [todos.length, tempTodo, errorMessage]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case 'active':
          return !todo.completed;

        case 'completed':
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;
  const allTodosCompleted = todos.length > 0 && activeTodosCount === 0;
  const isAdding = Boolean(tempTodo);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    hideError();
    setTempTodo({
      id: TEMP_TODO_ID,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo(trimmedTitle)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setNewTodoTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => setTempTodo(null));
  };

  const handleDeleteTodo = (todoId: number) => {
    hideError();
    markTodoAsLoading(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        showError('Unable to delete a todo');
        throw error;
      })
      .finally(() => unmarkTodoAsLoading(todoId));
  };

  const handleUpdateTodo = (todoId: number, data: Partial<Todo>) => {
    hideError();
    markTodoAsLoading(todoId);

    return updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(error => {
        showError('Unable to update a todo');
        throw error;
      })
      .finally(() => unmarkTodoAsLoading(todoId));
  };

  const handleToggleTodo = (todo: Todo) => {
    handleUpdateTodo(todo.id, { completed: !todo.completed }).catch(() => {});
  };

  const handleToggleAll = () => {
    const newCompletedStatus = !allTodosCompleted;

    todos
      .filter(todo => todo.completed !== newCompletedStatus)
      .forEach(todo => {
        handleUpdateTodo(todo.id, { completed: newCompletedStatus }).catch(
          () => {},
        );
      });
  };

  const startEditing = (todo: Todo | TempTodo) => {
    if (todo.id === TEMP_TODO_ID) {
      return;
    }

    editingCanceled.current = false;
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    editingCanceled.current = true;
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const submitTodoTitle = (todo: Todo) => {
    if (editingCanceled.current) {
      editingCanceled.current = false;

      return;
    }

    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo(todo.id)
        .then(cancelEditing)
        .catch(() => {});

      return;
    }

    handleUpdateTodo(todo.id, { title: trimmedTitle })
      .then(cancelEditing)
      .catch(() => {});
  };

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleDeleteTodo(todo.id).catch(() => {});
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todos.length}
          allTodosCompleted={allTodosCompleted}
          newTodoTitle={newTodoTitle}
          isAdding={isAdding}
          newTodoField={newTodoField}
          onAddTodo={handleAddTodo}
          onNewTodoTitleChange={setNewTodoTitle}
          onToggleAll={handleToggleAll}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            tempTodoId={TEMP_TODO_ID}
            loadingTodoIds={loadingTodoIds}
            editingTodoId={editingTodoId}
            editingTitle={editingTitle}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={todoId => handleDeleteTodo(todoId).catch(() => {})}
            onStartEditing={startEditing}
            onEditingTitleChange={setEditingTitle}
            onCancelEditing={cancelEditing}
            onSubmitTodoTitle={submitTodoTitle}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            filter={filter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onHideError={hideError} />
    </div>
  );
};
