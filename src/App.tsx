import { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState('');
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    if (editingTodoId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingTodoId]);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = newTodo.trim();

    if (!title) {
      setError('Title should not be empty');

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);
    setLoading(true);

    try {
      const newCreatedTodo = await createTodo(temp);

      setTodos(prev => [...prev, newCreatedTodo]);
      setNewTodo('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setError('');
    setLoadingTodos(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      inputRef.current?.focus();
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const toggleTodoStatus = async (todo: Todo) => {
    const updated = { ...todo, completed: !todo.completed };

    setLoadingTodos(prev => [...prev, todo.id]);
    try {
      const updatedTodo = await updateTodo(updated);

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(id => id !== todo.id));
    }
  };

  const toggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.filter(todo => todo.completed !== !allCompleted);

    await Promise.allSettled(
      updatedTodos.map(todo =>
        updateTodo({ ...todo, completed: !allCompleted })
          .then(updated => {
            setTodos(prev =>
              prev.map(t => (t.id === updated.id ? updated : t)),
            );
          })
          .catch(() => setError('Unable to update a todo')),
      ),
    );
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditedTitle(todo.title);
  };

  const saveEdit = async () => {
    const todo = todos.find(t => t.id === editingTodoId);

    if (!todo) {
      return;
    }

    const trimmed = editedTitle.trim();

    if (trimmed === '') {
      setLoadingTodos(prev => [...prev, todo.id]);
      try {
        await deleteTodo(todo.id);
        setTodos(prev => prev.filter(t => t.id !== todo.id));
        setEditingTodoId(null);
      } catch {
        setError('Unable to delete a todo');
      } finally {
        setLoadingTodos(prev => prev.filter(id => id !== todo.id));
      }

      return;
    }

    setLoadingTodos(prev => [...prev, todo.id]);
    try {
      const updated = await updateTodo({ ...todo, title: trimmed });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
      setEditingTodoId(null);
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      saveEdit();
    } else if (event.key === 'Escape') {
      setEditingTodoId(null);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <form onSubmit={handleAddTodo}>
            {!loading && todos.length > 0 && (
              <button
                type="button"
                className={`todoapp__toggle-all ${
                  todos.every(todo => todo.completed) ? 'active' : ''
                }`}
                onClick={toggleAll}
                data-cy="ToggleAllButton"
              />
            )}

            <input
              type="text"
              placeholder="What needs to be done?"
              className="todoapp__new-todo"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              ref={inputRef}
              disabled={loading}
              data-cy="NewTodoField"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''} ${
                editingTodoId === todo.id ? 'editing' : ''
              }`}
            >
              <label
                className="todo__status-label"
                aria-label={
                  todo.completed ? 'Mark as active' : 'Mark as completed'
                }
              >
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => toggleTodoStatus(todo)}
                  data-cy="TodoStatus"
                />
              </label>

              {editingTodoId === todo.id ? (
                <input
                  type="text"
                  className="todo__title-field"
                  value={editedTitle}
                  onChange={e => setEditedTitle(e.target.value)}
                  onBlur={saveEdit}
                  onKeyUp={handleKeyUp}
                  ref={editInputRef}
                  data-cy="TodoTitleField"
                />
              ) : (
                <>
                  <span
                    className="todo__title"
                    onDoubleClick={() => handleEditTodo(todo)}
                    data-cy="TodoTitle"
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => handleDeleteTodo(todo.id)}
                    disabled={loadingTodos.includes(todo.id)}
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>
                </>
              )}

              <div
                data-cy="TodoLoader"
                className={`modal overlay ${loadingTodos.includes(todo.id) ? 'is-active' : ''}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodo && !todos.find(t => t.title === tempTodo.title) && (
            <div className="todo" data-cy="Todo">
              <input
                type="checkbox"
                className="todo__status"
                disabled
                data-cy="TodoStatus"
              />
              <span className="todo__title" data-cy="TodoTitle">
                {tempTodo.title}
              </span>
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
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
              onClick={async () => {
                const completedTodos = todos.filter(todo => todo.completed);

                try {
                  await Promise.all(
                    completedTodos.map(todo => handleDeleteTodo(todo.id)),
                  );
                } catch {
                  setError('An error occurred while deleting todos');
                }
              }}
              disabled={loading || todos.every(todo => !todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className={`notification is-danger is-light has-text-weight-normal closehidden ${
          error ? '' : 'hidden'
        }`}
        data-cy="ErrorNotification"
      >
        <button
          type="button"
          className="delete"
          onClick={() => setError('')}
          data-cy="HideErrorButton"
        />
        {error}
      </div>
    </div>
  );
};
