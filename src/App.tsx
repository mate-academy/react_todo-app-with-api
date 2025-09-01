/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as serverManager from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

type FilterType = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  if (!serverManager.USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [hasTitleError, setHasTitleError] = useState(false);
  const [unableToLoadTodos, setUnableToLoadTodos] = useState(false);
  const [unableToAddTodo, setUnableToAddTodo] = useState(false);
  const [unableToUpdateTodo, setUnableToUpdateTodo] = useState(false);
  const [unableToDeleteTodo, setUnableToDeleteTodo] = useState(false);
  const [hasAnyError, setHasAnyError] = useState(false);
  const [showError, setShowError] = useState(false);

  const [todoIsLoading, setTodoIsLoading] = useState<{ [id: number]: boolean }>(
    {},
  );
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [tempTitles, setTempTitles] = useState<{ [id: number]: string }>({});
  const [tempStatuses, setTempStatuses] = useState<{ [id: number]: boolean }>(
    {},
  );

  const inputDisabled =
    isCreating || Object.values(todoIsLoading).some(Boolean);

  const visibleTodos = todos.filter(todo => {
    const statusForFiltering = todoIsLoading[todo.id]
      ? todo.completed
      : tempStatuses.hasOwnProperty(todo.id)
        ? tempStatuses[todo.id]
        : todo.completed;

    // Fixed, now using switch case.
    switch (filterType) {
      case 'active':
        return !statusForFiltering;
      case 'completed':
        return statusForFiltering;
      default:
        return true;
    }
  });

  const clearErrors = () => {
    setHasTitleError(false);
    setUnableToLoadTodos(false);
    setUnableToAddTodo(false);
    setUnableToUpdateTodo(false);
    setUnableToDeleteTodo(false);
    setShowError(false);
  };

  function loadTodos() {
    setIsLoadingTodos(true);
    serverManager
      .getTodos()
      .then(setTodos)
      .catch(() => setUnableToLoadTodos(true))
      .finally(() => setIsLoadingTodos(false));
  }

  function createTodo(title: string) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setHasTitleError(true);

      return;
    }

    const temp: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: serverManager.USER_ID,
    };

    setTempTodo(temp);
    setIsCreating(true);

    serverManager
      .addTodo({
        title: trimmedTitle,
        userId: serverManager.USER_ID,
        completed: false,
      })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTodoTitle('');
      })
      .catch(() => setUnableToAddTodo(true))
      .finally(() => {
        setTempTodo(null);
        setIsCreating(false);
      });
  }

  function updateTodo(todo: Todo, isFromTitleEdit = false) {
    setTodoIsLoading(prev => ({ ...prev, [todo.id]: true }));

    serverManager
      .updateTodo({ ...todo, title: todo.title.trim() })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
        setTempTitles(prev => {
          const copy = { ...prev };

          delete copy[todo.id];

          return copy;
        });
        setTempStatuses(prev => {
          const copy = { ...prev };

          delete copy[todo.id];

          return copy;
        });
        if (isFromTitleEdit) {
          setEditingTodoId(null);
        }
      })
      .catch(() => {
        setUnableToUpdateTodo(true);
        setTempTitles(prev => {
          const copy = { ...prev };

          delete copy[todo.id];

          return copy;
        });
        setTempStatuses(prev => {
          const copy = { ...prev };

          delete copy[todo.id];

          return copy;
        });
        if (isFromTitleEdit) {
          setEditingTodoId(todo.id);
          setEditingTitle(todo.title);
        }
      })
      .finally(() => {
        setTodoIsLoading(prev => {
          const copy = { ...prev };

          delete copy[todo.id];

          return copy;
        });
      });
  }

  function deleteTodo(
    todoId: number,
    fromTitleEdit = false,
    originalTitle = '',
  ) {
    setTodoIsLoading(prev => ({ ...prev, [todoId]: true }));

    serverManager
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
        if (fromTitleEdit) {
          setEditingTodoId(null);
        }
      })
      .catch(() => {
        setUnableToDeleteTodo(true);
        if (fromTitleEdit) {
          setEditingTitle(originalTitle);
        }
      })
      .finally(() => {
        setTodoIsLoading(prev => {
          const copy = { ...prev };

          delete copy[todoId];

          return copy;
        });
        if (!fromTitleEdit) {
          setTimeout(() => {
            const inputElement = document.querySelector(
              '.todoapp__new-todo',
            ) as HTMLInputElement;

            inputElement?.focus();
          }, 0);
        }
      });
  }

  const handleToggleAll = () => {
    const allCompleted = todos.every(t => t.completed);

    todos.forEach(t => {
      if (t.completed === allCompleted) {
        const newStatus = !allCompleted;

        setTempStatuses(prev => ({ ...prev, [t.id]: newStatus }));
        updateTodo({ ...t, completed: newStatus }, false);
      }
    });
  };

  const handleToggleTodo = (todo: Todo) => {
    const newStatus = !todo.completed;

    setTempStatuses(prev => ({ ...prev, [todo.id]: newStatus }));
    updateTodo({ ...todo, completed: newStatus }, false);
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id, false, todo.title),
    );

    await Promise.all(deletePromises);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    setHasAnyError(
      hasTitleError ||
        unableToLoadTodos ||
        unableToAddTodo ||
        unableToUpdateTodo ||
        unableToDeleteTodo,
    );
  }, [
    hasTitleError,
    unableToLoadTodos,
    unableToAddTodo,
    unableToUpdateTodo,
    unableToDeleteTodo,
  ]);

  useEffect(() => {
    if (hasAnyError) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasAnyError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          onCreateTodo={createTodo}
          onToggleAll={handleToggleAll}
          inputDisabled={inputDisabled}
          isCreating={isCreating}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          todoIsLoading={todoIsLoading}
          tempTitles={tempTitles}
          tempStatuses={tempStatuses}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          onToggleTodo={handleToggleTodo}
          onUpdateTodo={updateTodo}
          onDeleteTodo={deleteTodo}
          setEditingTodoId={setEditingTodoId}
          isCreating={isCreating}
        />

        {todos.length > 0 && !isLoadingTodos && (
          <TodoFooter
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        showError={showError}
        hasTitleError={hasTitleError}
        unableToLoadTodos={unableToLoadTodos}
        unableToAddTodo={unableToAddTodo}
        unableToUpdateTodo={unableToUpdateTodo}
        unableToDeleteTodo={unableToDeleteTodo}
        onClearErrors={clearErrors}
      />
    </div>
  );
};
