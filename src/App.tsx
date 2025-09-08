/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  changeTodoCompleted,
  changeTodoTitle,
  getTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { addTodo } from './api/todos';
import { deleteTodo } from './api/todos';
import { TodoItem } from './components/TodoItem/TodoItem';

type Status = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  // #region States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Status>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  // #endregion

  // #region Effects
  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (!adding) {
      inputRef.current?.focus();
    }
  }, [adding]);

  if (!USER_ID) {
    return <UserWarning />;
  }
  // #endregion

  // #region Functions
  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = newTodo.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setAdding(true);
    setErrorMessage('');

    const temp: Todo = {
      id: Date.now(),
      userId: USER_ID,
      title,
      completed: false,
      loading: true,
    };

    setTempTodo(temp);

    try {
      const addedTodo = await addTodo(title, USER_ID);

      setTodos(prev => [...prev, { ...addedTodo, loading: false }]);
      setNewTodo('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setAdding(false);
      inputRef.current?.focus();
      setTempTodo(null);
    }
  };

  const handleDelete = async (todo: Todo) => {
    setDeletingIds(prev => [...prev, todo.id]);
    try {
      await deleteTodo(todo);
      setTodos(prev => prev.filter(t => t.id !== todo.id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== todo.id));
      inputRef.current?.focus();
    }
  };

  const handleToggle = async (todo: Todo) => {
    setTodos(prev =>
      prev.map(t => (t.id === todo.id ? { ...t, loading: true } : t)),
    );

    try {
      const updated = await changeTodoCompleted(todo);

      setTodos(prev => {
        return prev.map(t => (t.id === todo.id ? { ...t, ...updated } : t));
      });
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, loading: false } : t)),
      );
    }
  };

  const handleCleaner = async () => {
    const completedTodos = todos.filter(t => t.completed);
    const completedIds = completedTodos.map(t => t.id);

    setDeletingIds(prev => [...prev, ...completedIds]);

    const results = await Promise.allSettled(completedTodos.map(deleteTodo));

    setTodos(prev =>
      prev.filter(
        t =>
          !completedIds.includes(t.id) ||
          results[completedIds.indexOf(t.id)].status === 'rejected',
      ),
    );

    // якщо хоч один failed
    if (results.some(r => r.status === 'rejected')) {
      setErrorMessage('Unable to delete a todo');
    }

    setDeletingIds(prev => prev.filter(id => !completedIds.includes(id)));
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleChangeTodo = async (todo: Todo, newTitle: string) => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      return true;
    }

    if (trimmedTitle === '') {
      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, loading: true } : t)),
      );

      try {
        await deleteTodo(todo);
        setTodos(prev => prev.filter(t => t.id !== todo.id));

        return true;
      } catch {
        setErrorMessage('Unable to delete a todo');

        return false;
      } finally {
        setTodos(prev =>
          prev.map(t => (t.id === todo.id ? { ...t, loading: false } : t)),
        );
      }
    }

    setTodos(prev =>
      prev.map(t => (t.id === todo.id ? { ...t, loading: true } : t)),
    );

    try {
      const newTd = await changeTodoTitle(todo, trimmedTitle);

      setTodos(prev => prev.map(t => (t.id === todo.id ? newTd : t)));

      return true;
    } catch {
      setErrorMessage('Unable to update a todo');

      return false;
    } finally {
      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, loading: false } : t)),
      );
    }
  };

  const handleCompleteAll = async (todoList: Todo[]) => {
    const allCompleted = todoList.every(todo => todo.completed);

    const todosToToggle = allCompleted
      ? todoList // всі, бо треба зробити незавершеними
      : todoList.filter(todo => !todo.completed); // тільки незавершені

    const todosToToggleIds = todosToToggle.map(todo => todo.id);

    setTodos(prev =>
      prev.map(t =>
        todosToToggleIds.includes(t.id) ? { ...t, loading: true } : t,
      ),
    );

    try {
      await Promise.all(todosToToggle.map(todo => changeTodoCompleted(todo)));

      setTodos(prev =>
        prev.map(t =>
          todosToToggleIds.includes(t.id)
            ? { ...t, completed: !allCompleted }
            : t,
        ),
      );
    } catch {
      setErrorMessage('Unable to update todo');
    } finally {
      setTodos(prev =>
        prev.map(t =>
          todosToToggleIds.includes(t.id) ? { ...t, loading: false } : t,
        ),
      );
    }
  };

  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${todos.length > 0 && todos.every(t => t.completed) ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={() => handleCompleteAll(todos)}
            />
          )}
          {/* Add a todo on form submit */}
          <form onSubmit={e => handleSubmit(e)}>
            <input
              id="input"
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={event => setNewTodo(event.target.value)}
              autoFocus
              ref={inputRef}
              disabled={adding}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          <TodoList
            className={`${todos.length === 0 ? 'hidden' : ''}`}
            todos={visibleTodos}
            handleDelete={handleDelete}
            deletingIds={deletingIds}
            handleToggle={handleToggle}
            editingId={editingId}
            setEditingId={setEditingId}
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
            handleChangeTodo={handleChangeTodo}
          />
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              handleDelete={() => {}}
              deletingIds={[]}
            />
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer
            className={`todoapp__footer ${todos.length === 0 ? 'hidden' : ''}`}
            data-cy="Footer"
          >
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

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => handleCleaner()}
              disabled={todos.filter(todo => todo.completed).length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
