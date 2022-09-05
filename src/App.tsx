/* eslint-disable no-console */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React,
{ FormEvent,
  useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { User } from './types/User';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { TodosList } from './components/TodosList';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  // const [filterOption, setFilterOption] = useState('All');
  const [addError, setAddError] = useState(false);
  const [deleteError] = useState(false);
  const [updateError] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getTodos(user?.id)
        .then(gotTodos => setTodos(gotTodos));
    }

    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const anyError = addError || deleteError || updateError;

  const onAdd = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  };

  const onDelete = (todo: Todo) => {
    setTodos(prevTodos => prevTodos.filter(prevTodo => prevTodo !== todo));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (title.trim() === '') {
      setAddError(true);

      return;
    }

    const newTodo = {
      title,
      userId: user?.id,
      completed: false,
    };

    client.post<Todo>('/todos', newTodo)
      .then(todo => {
        onAdd(todo);
      });
    setTitle('');
  };

  const onLogin = useCallback((newUser: User) => {
    console.log(newUser);
  }, []);

  /*   const getFilteredTodos = useCallback((option: string) => {
    switch (option) {
      case 'active':
        return todos.filter(todo => todo.completed === false);
      case 'completed':
        return todos.filter(todo => todo.completed === true);
      default:
        return todos;
    }
  }, [todos]); */

  if (!user) {
    return (
      <AuthForm onLogin={onLogin} />
    );
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form
            onSubmit={onSubmit}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodosList todos={todos} onDelete={onDelete} />

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${todos.length} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className="filter__link selected"
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className="filter__link"
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className="filter__link"
            >
              Completed
            </a>
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            disabled={!todos.some(todo => todo.completed)}
          >
            Clear completed
          </button>
        </footer>
      </div>

      { anyError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
          />

          {addError && 'Unable to add a todo'}
          <br />
          {deleteError && 'Unable to delete a todo'}
          <br />
          {updateError && 'Unable to update a todo'}
        </div>
      )}
    </div>
  );
};
