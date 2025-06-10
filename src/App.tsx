/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { USER_ID, getTodos, uppTodos, deleteTodo, addTodo } from './api/todos';

export const App: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const newTodoInputRef = useRef<HTMLInputElement>(null);
  const [originalTitles, setOriginalTitles] = useState<Record<number, string>>(
    {},
  );
  const [todosLoaded, setTodosLoaded] = useState(false);

  useEffect(() => {
    // Prevent multiple requests
    if (todosLoaded) {
      return;
    }

    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setTodosLoaded(true);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTodosLoaded(true); // Mark as loaded even on error to prevent retries
      });
  }, [todosLoaded]);
  // Auto-hide error after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const showError = (message: string) => {
    setErrorMessage(message);
  };

  const hideError = () => {
    setErrorMessage('');
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      showError('Title should not be empty');

      return;
    }

    const tempId = -Date.now(); // Negative ID for temp todo
    const optimisticTodo: Todo = {
      id: tempId,
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsAdding(true);
    setTodos(prev => [...prev, optimisticTodo]);
    setLoadingTodos(prev => [...prev, tempId]);

    try {
      const newTodo = await addTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prev => prev.map(t => (t.id === tempId ? newTodo : t)));
      setNewTodoTitle(''); // Only clear after successful response

      // Focus after DOM updates
      setTimeout(() => {
        newTodoInputRef.current?.focus();
      }, 0);
    } catch (error) {
      setTodos(prev => prev.filter(t => t.id !== tempId));
      showError('Unable to add a todo');

      // Focus after DOM updates on error
      setTimeout(() => {
        newTodoInputRef.current?.focus();
      }, 0);
    } finally {
      setIsAdding(false);
      setLoadingTodos(prev => prev.filter(id => id !== tempId));
    }
  };

  const handleToggle = async (id: number) => {
    setLoadingTodos(prev => [...prev, id]);

    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    const updated = { ...todo, completed: !todo.completed };

    try {
      await uppTodos(id, updated);
      setTodos(todos.map(t => (t.id === id ? updated : t)));
    } catch (error) {
      showError('Unable to update a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(tid => tid !== id));
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingTodos(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));

      // Focus text field after successful deletion
      setTimeout(() => {
        newTodoInputRef.current?.focus();
      }, 0);
    } catch (error) {
      showError('Unable to delete a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(tid => tid !== id));
    }
  };

  const handleEditTitleChange = (id: number, newTitle: string) => {
    setTodos(todos.map(t => (t.id === id ? { ...t, title: newTitle } : t)));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // Update the double-click handler to store the original title
  const handleStartEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setOriginalTitles(prev => ({
      ...prev,
      [todo.id]: todo.title,
    }));
  };

  // Update the handleEditCancel function
  const handleEditCancel = (id: number) => {
    const originalTitle = originalTitles[id];

    if (originalTitle !== undefined) {
      // Restore the original title
      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === id ? { ...t, title: originalTitle } : t)),
      );
    }

    setEditingTodoId(null);

    // Clean up the stored original title
    setOriginalTitles(prev => {
      const updated = { ...prev };

      delete updated[id];

      return updated;
    });
  };

  // Update the handleSaveEdit function to clean up stored title
  // Replace the handleSaveEdit function with this updated version:

  // Replace the handleSaveEdit function with this updated version:

  const handleSaveEdit = async (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    const trimmedTitle = todo.title.trim();
    const originalTitle = originalTitles[id];

    // If title is empty after trimming, delete the todo
    if (trimmedTitle === '') {
      await handleDelete(id);

      return;
    }

    // If title hasn't changed, just close the edit form
    if (trimmedTitle === originalTitle) {
      setEditingTodoId(null);

      // Clean up the stored original title
      setOriginalTitles(prev => {
        const updated = { ...prev };

        delete updated[id];

        return updated;
      });

      return;
    }

    // Create updated todo with trimmed title
    const updatedTodo = { ...todo, title: trimmedTitle };

    // Update local state with trimmed title immediately
    setTodos(prevTodos => prevTodos.map(t => (t.id === id ? updatedTodo : t)));

    setLoadingTodos(prev => [...prev, id]);

    try {
      await uppTodos(id, updatedTodo);
      setEditingTodoId(null);

      // Clean up the stored original title on successful save
      setOriginalTitles(prev => {
        const updated = { ...prev };

        delete updated[id];

        return updated;
      });
    } catch (error) {
      // On error, we could revert to the original title or keep the trimmed version
      // Since the local state already has the trimmed version, we'll keep it
      // but you could restore the original if preferred
      showError('Unable to update a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(tid => tid !== id));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);
    const completedIds = completedTodos.map(t => t.id);

    if (completedIds.length === 0) {
      return;
    }

    setLoadingTodos(prev => [...prev, ...completedIds]);

    try {
      // Use Promise.allSettled to handle partial failures
      const results = await Promise.allSettled(
        completedIds.map(id => deleteTodo(id)),
      );

      // Separate successful and failed deletions
      const successfulIds: number[] = [];
      const failedIds: number[] = [];

      results.forEach((result, index) => {
        const todoId = completedIds[index];

        if (result.status === 'fulfilled') {
          successfulIds.push(todoId);
        } else {
          failedIds.push(todoId);
        }
      });

      // Update todos to remove only successfully deleted ones
      if (successfulIds.length > 0) {
        setTodos(prevTodos =>
          prevTodos.filter(t => !successfulIds.includes(t.id)),
        );
      }

      // Show error if any deletions failed
      if (failedIds.length > 0) {
        const errorMsg =
          failedIds.length === 1
            ? 'Unable to delete a todo'
            : `Unable to delete ${failedIds.length} todos`;

        showError(errorMsg);
      }

      // Focus the text field on successful completion (even partial success)
      if (successfulIds.length > 0) {
        const newTodoField = document.querySelector(
          '[data-cy="NewTodoField"]',
        ) as HTMLInputElement;

        if (newTodoField) {
          newTodoField.focus();
        }
      }
    } catch (error) {
      // This catch block should rarely be reached with Promise.allSettled
      showError('Unable to delete completed todos');
    } finally {
      setLoadingTodos(prev => prev.filter(id => !completedIds.includes(id)));
    }
  };

  // Filter out temp todos (with negative IDs) from counter calculations
  const confirmedTodos = todos.filter(todo => todo.id > 0);
  const activeTodosCount = confirmedTodos.filter(
    todo => !todo.completed,
  ).length;
  const completedTodosCount = confirmedTodos.filter(
    todo => todo.completed,
  ).length;

  const handleToggleAll = async () => {
    const allCompleted =
      confirmedTodos.length > 0 && confirmedTodos.every(todo => todo.completed);
    const targetCompleted = !allCompleted;

    // Get todos that need to be updated
    const todosToUpdate = confirmedTodos.filter(
      todo => todo.completed !== targetCompleted,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    // Add all todos being updated to loading state
    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setLoadingTodos(prev => [...prev, ...idsToUpdate]);
    try {
      // Update all todos with Promise.allSettled to handle partial failures
      const results = await Promise.allSettled(
        todosToUpdate.map(todo =>
          uppTodos(todo.id, { ...todo, completed: targetCompleted }),
        ),
      );

      // Separate successful and failed updates
      const successfulIds: number[] = [];
      const failedIds: number[] = [];

      results.forEach((result, index) => {
        const todoId = idsToUpdate[index];

        if (result.status === 'fulfilled') {
          successfulIds.push(todoId);
        } else {
          failedIds.push(todoId);
        }
      });

      // Update todos for successful operations
      if (successfulIds.length > 0) {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            successfulIds.includes(todo.id)
              ? { ...todo, completed: targetCompleted }
              : todo,
          ),
        );
      }

      // Show error if any updates failed
      if (failedIds.length > 0) {
        const errorMsg =
          failedIds.length === 1
            ? 'Unable to update a todo'
            : `Unable to update ${failedIds.length} todos`;

        showError(errorMsg);
      }
    } catch (error) {
      showError('Unable to update todos');
    } finally {
      setLoadingTodos(prev => prev.filter(id => !idsToUpdate.includes(id)));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* Only show toggle all button if there are confirmed todos */}
          {confirmedTodos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all${
                confirmedTodos.every(todo => todo.completed) ? ' active' : ''
              }`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={newTodoInputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAdding}
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => {
            const isEditing = editingTodoId === todo.id;
            const isLoading = loadingTodos.includes(todo.id);
            const todoClass = `todo${todo.completed ? ' completed' : ''}`;

            return (
              <div
                data-cy="Todo"
                className={`${todoClass}${isLoading ? ' loading' : ''}`}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                    disabled={isLoading}
                  />
                </label>

                {isEditing ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleSaveEdit(todo.id);
                    }}
                  >
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={todo.title}
                      onChange={e =>
                        handleEditTitleChange(todo.id, e.target.value)
                      }
                      onBlur={() => handleSaveEdit(todo.id)}
                      onKeyDown={e => {
                        if (e.key === 'Escape') {
                          handleEditCancel(todo.id);
                        }
                      }}
                      autoFocus
                    />
                  </form>
                ) : (
                  <>
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => handleStartEdit(todo)}
                    >
                      {todo.title}
                    </span>
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => handleDelete(todo.id)}
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </>
                )}

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay${isLoading ? ' is-active' : ''}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={e => {
                  e.preventDefault();
                  setFilter('all');
                }}
              >
                All
              </a>
              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={e => {
                  e.preventDefault();
                  setFilter('active');
                }}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={e => {
                  e.preventDefault();
                  setFilter('completed');
                }}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodosCount === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal${
          errorMessage ? '' : ' hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
