/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load todos on mount
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  // Auto-focus input after add/delete operations
  useEffect(() => {
    if (!isAddingTodo) {
      inputRef.current?.focus();
    }
  }, [isAddingTodo, todos]);

  const handleCloseError = useCallback(() => {
    setErrorMessage('');
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const hasCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  // All todos completed — used for toggleAll active class
  const allCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );

  // --- ADD ---
  const handleAddTodo = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      const trimmedTitle = newTodoTitle.trim();

      setErrorMessage('');

      if (!trimmedTitle) {
        setErrorMessage('Title should not be empty');

        return;
      }

      setIsAddingTodo(true);

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      addTodo(trimmedTitle)
        .then(createdTodo => {
          setTodos(currentTodos => [...currentTodos, createdTodo]);
          setNewTodoTitle('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setIsAddingTodo(false);
        });
    },
    [newTodoTitle],
  );

  // --- DELETE ---
  const handleDeleteTodo = useCallback((todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(current => current.filter(id => id !== todoId));
      });
  }, []);

  // --- CLEAR COMPLETED ---
  const handleClearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  }, [todos, handleDeleteTodo]);

  // --- TOGGLE ---
  const handleToggleTodo = useCallback((todo: Todo) => {
    setLoadingTodoIds(current => [...current, todo.id]);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoIds(current => current.filter(id => id !== todo.id));
      });
  }, []);

  // --- TOGGLE ALL ---
  const handleToggleAll = useCallback(() => {
    // If all are completed, uncomplete all. Otherwise, complete the active ones.
    const newStatus = !allCompleted;
    const todosToToggle = todos.filter(todo => todo.completed !== newStatus);

    todosToToggle.forEach(todo => {
      handleToggleTodo(todo);
    });
  }, [todos, allCompleted, handleToggleTodo]);

  // --- UPDATE (RENAME) ---
  const handleUpdateTodo = useCallback(
    (todo: Todo, data: { title: string }): Promise<void> => {
      setLoadingTodoIds(current => [...current, todo.id]);

      return updateTodo(todo.id, data)
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          throw new Error('Unable to update a todo');
        })
        .finally(() => {
          setLoadingTodoIds(current => current.filter(id => id !== todo.id));
        });
    },
    [],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', { active: allCompleted })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={isAddingTodo}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              loadingTodoIds={loadingTodoIds}
              onDelete={handleDeleteTodo}
              onToggle={handleToggleTodo}
              onUpdate={handleUpdateTodo}
            />

            {tempTodo && <TodoItem todo={tempTodo} isLoading />}

            <TodoFooter
              activeTodosCount={activeTodosCount}
              filterStatus={filterStatus}
              hasCompletedTodos={hasCompletedTodos}
              onFilterChange={setFilterStatus}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={handleCloseError}
      />
    </div>
  );
};
