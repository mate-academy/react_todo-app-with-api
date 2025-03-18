/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/todo';
import { UserWarning } from './UserWarning';
import {
  deleteTodos,
  getTodos,
  patchTodos,
  postTodos,
  USER_ID,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [activeTodosCount, setActiveTodosCount] = useState(0);

  useEffect(() => {
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMsg('Unable to load todos');
        setTimeout(() => setErrorMsg(null), 3000);
      })
      .finally(() => setLoading(false));
  }, []);

  const newTodoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loading && newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [loading]);

  const editInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingTodo !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTodo]);

  useEffect(() => {
    const activeCount = todos.filter(
      todo => !todo.completed && !todo.isTemp,
    ).length;

    setActiveTodosCount(activeCount);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    const newCompletedState = !areAllCompleted;

    setTodos(prevTodos =>
      prevTodos.map(todo => ({
        ...todo,
        completed: newCompletedState,
        isTemp: true,
      })),
    );

    setLoading(true);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedState,
    );

    setActiveTodosCount(() =>
      newCompletedState
        ? 0
        : todos.filter(todo => !todo.completed && !todo.isTemp).length,
    );

    const updatePromises = todosToUpdate.map(todo =>
      patchTodos(todo.id, { completed: newCompletedState })
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.map(t =>
              t.id === todo.id ? { ...t, isTemp: false } : t,
            ),
          );
        })
        .catch(() => setErrorMsg('Unable to update todos')),
    );

    Promise.all(updatePromises)
      .then(() => setTimeout(() => setLoading(false), 1000))
      .catch(() => setLoading(false));
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMsg('Title should not be empty');

      setTimeout(() => {
        setErrorMsg(null);
      }, 3000);

      return;
    }

    setErrorMsg(null);
    setLoading(true);

    const tempTodo = {
      id: Date.now(),
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
      isTemp: true,
    };

    setTodos(prevTodos => [...prevTodos, tempTodo]);

    postTodos({ title: trimmedTitle, completed: false })
      .then(createdTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === tempTodo.id ? { ...createdTodo, isTemp: false } : todo,
          ),
        );
        setActiveTodosCount(prevCount => prevCount + 1);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMsg('Unable to add a todo');

        setTimeout(() => {
          setErrorMsg(null);
        }, 3000);

        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== tempTodo.id),
        );
        setActiveTodosCount(prevCount => prevCount - 1);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleToggleComplete = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed, isTemp: true };

    setTodos(prevTodos =>
      prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
    );

    setLoading(true);

    patchTodos(todo.id, { completed: updatedTodo.completed })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === todo.id ? { ...t, isTemp: false } : t)),
        );
      })
      .catch(() => {
        setErrorMsg('Unable to update a todo');
        setTimeout(() => setErrorMsg(null), 3000);
        setTodos(prevTodos =>
          prevTodos.map(t =>
            t.id === todo.id
              ? { ...t, completed: todo.completed, isTemp: false }
              : t,
          ),
        );
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteTodo = (id: number) => {
    setLoading(true);

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, isTemp: true } : todo,
      ),
    );
    deleteTodos(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
        setActiveTodosCount(prevCount => prevCount - 1);
      })
      .catch(() => {
        setErrorMsg('Unable to delete a todo');
        setTimeout(() => setErrorMsg(null), 3000);
      })
      .finally(() => {
        setLoading(false);
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.isTemp ? { ...todo, isTemp: false } : todo,
          ),
        );
      });
  };

  const handleEditTodo = (id: number, title: string) => {
    setEditingTodo(id);
    setEditingTitle(title.trim());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEditingTodo(null);
        setEditingTitle('');
        document.removeEventListener('keydown', handleKeyDown);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
  };

  const handleSaveEdit = (todo: Todo) => {
    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingTodo(null);

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo(todo.id);

      return;
    }

    setLoading(true);

    setTodos(prevTodos =>
      prevTodos.map(t =>
        t.id === todo.id ? { ...t, title: trimmedTitle, isTemp: true } : t,
      ),
    );

    patchTodos(todo.id, { title: trimmedTitle })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === todo.id ? { ...t, isTemp: false } : t)),
        );
        setEditingTodo(null);
      })
      .catch(() => {
        setErrorMsg('Unable to update a todo');
        setTimeout(() => setErrorMsg(null), 3000);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 1000);
      });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoading(true);

    for (const todo of completedTodos) {
      try {
        await deleteTodos(todo.id);

        setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        setActiveTodosCount(prevCount => prevCount - 1);
      } catch (error) {
        setErrorMsg('Unable to delete a todo');
        setTimeout(() => setErrorMsg(null), 3000);
      }
    }

    setLoading(false);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed || todo.isTemp;
    }

    if (filter === 'completed') {
      return todo.completed || todo.isTemp;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && !loading && (
            <button
              type="button"
              className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
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
              disabled={loading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''} ${todo.isTemp ? 'loading' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  disabled={todo.isTemp}
                />
              </label>

              {editingTodo === todo.id ? (
                <form
                  onSubmit={event => {
                    event.preventDefault();
                    handleSaveEdit(todo);
                  }}
                >
                  <input
                    ref={editInputRef}
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(todo)}
                  />
                </form>
              ) : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => handleEditTodo(todo.id, todo.title)}
                  >
                    {todo.title}
                  </span>

                  {!todo.isTemp && (
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      ×
                    </button>
                  )}
                </>
              )}
              <div
                data-cy="TodoLoader"
                className={`modal overlay ${loading && todo.isTemp ? 'is-active' : ''}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'}{' '}
              left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={todos.every(todo => !todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMsg ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMsg(null)}
        />
        {errorMsg}
      </div>
    </div>
  );
};
