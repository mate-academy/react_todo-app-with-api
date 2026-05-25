/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoErrors, ValidationErrors } from './constants/errors';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');

  const [filter, setFilter] = useState<Filter>('all');
  const [title, setTitle] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  // load todos
  useEffect(() => {
    getTodos()
      .then(data => setTodos(data))
      .catch(() => setError(TodoErrors.LOAD));
  }, []);

  // auto-hide error
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  // loading state
  const startLoading = (id: number) => {
    setLoadingIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  // stop loading
  const stopLoading = (id: number) => {
    setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
  };

  // toggle todo completed status
  const handleToggle = (todo: Todo) => {
    startLoading(todo.id);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(data => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todo.id ? data : currentTodo,
          ),
        );
      })
      .catch(() => {
        setError(TodoErrors.UPDATE);
      })
      .finally(() => {
        stopLoading(todo.id);
      });
  };

  //active todos count for the footer
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  //completed todos count for the footer
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  // filter todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // add a new todo (form submit handler)
  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // validation
    if (title.trim() === '') {
      setError(ValidationErrors.EMPTY_TITLE);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    //add a new todo to the server
    addTodo({
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTitle('');
        inputRef.current?.focus();
        setTempTodo(null);
      })
      .catch(() => {
        setError(TodoErrors.ADD);
        setTempTodo(null);
      })
      .finally(() => {
        setIsSubmitting(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });

    // add temporary todo
    const temporaryTodo: Todo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temporaryTodo);
  };

  // delete a todo
  const handleDeleteTodo = (id: number) => {
    if (loadingIds.includes(id)) {
      return;
    }

    startLoading(id);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(TodoErrors.DELETE);
      })
      .finally(() => {
        stopLoading(id);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  // delete all completed todos
  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  // toggle all todos status
  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    todos.forEach(todo => {
      if (todo.completed !== newStatus) {
        startLoading(todo.id);

        updateTodo(todo.id, { completed: newStatus })
          .then(updatedTodo => {
            setTodos(current =>
              current.map(item => (item.id === todo.id ? updatedTodo : item)),
            );
          })
          .catch(() => {
            setError(TodoErrors.UPDATE);
          })
          .finally(() => {
            stopLoading(todo.id);
          });
      }
    });
  };

  // edit a todo (double click handler)
  const handleEditTodo = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  // save edited todo (form submit handler)
  const handleSaveTodo = (todo: Todo) => {
    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmedTitle) {
      startLoading(todo.id);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(current => current.filter(t => t.id !== todo.id));
          setEditingId(null);
        })
        .catch(() => {
          setError(TodoErrors.DELETE);
        })
        .finally(() => {
          stopLoading(todo.id);
        });

      return;
    }

    startLoading(todo.id);

    updateTodo(todo.id, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(item => (item.id === todo.id ? updatedTodo : item)),
        );

        setEditingId(null);
        setEditingTitle('');
      })
      .catch(() => {
        setError(TodoErrors.UPDATE);
      })
      .finally(() => {
        stopLoading(todo.id);
      });
  };

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
              className={`todoapp__toggle-all ${activeTodosCount === 0 ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isSubmitting}
              ref={inputRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => {
                return (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    editingId={editingId}
                    editingTitle={editingTitle}
                    loadingIds={loadingIds}
                    handleToggle={handleToggle}
                    handleEditTodo={handleEditTodo}
                    handleSaveTodo={handleSaveTodo}
                    handleDeleteTodo={handleDeleteTodo}
                    onChangeEditingTitle={setEditingTitle}
                    onChangeEditingId={setEditingId}
                  />
                );
              })}

              {tempTodo && (
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      disabled
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    {/* eslint-disable-next-line max-len */}
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>

            <Footer
              filter={filter}
              activeTodosCount={activeTodosCount}
              completedTodosCount={completedTodosCount}
              onFilterChange={setFilter}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} onClose={setError} />
    </div>
  );
};
