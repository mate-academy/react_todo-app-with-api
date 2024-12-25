import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../services/TodoContext';

type Props = {};

export const Header: React.FC<Props> = () => {
  const { todos, updateTodo, addTodo, setErrorMessage } =
    useContext(TodoContext);
  const [title, setTitle] = useState('');
  const titleField = useRef<HTMLInputElement>(null);
  const [creating, setCreating] = useState(false);
  const [titleOnError, setTitleOnError] = useState('');

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  useEffect(() => {
    if (!creating && todos.length > 0) {
      titleField.current?.focus();
    }
  }, [creating, todos]);

  useEffect(() => {
    if (!titleOnError) {
      setTitle(titleOnError);
    }
  }, [titleOnError]);

  const handleToggleTodos = () => {
    if (completedTodos.length === todos.length) {
      for (const todo of completedTodos) {
        updateTodo({ ...todo, completed: false });
      }
    } else {
      for (const todo of activeTodos) {
        updateTodo({ ...todo, completed: true });
      }
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    setTitleOnError(trimmedTitle);
    setTitle('');
    setCreating(true);

    try {
      await addTodo(trimmedTitle);
      setTitleOnError('');
      setTitle('');
    } catch (error) {
      setTitleOnError(trimmedTitle);
    } finally {
      setCreating(false);
      setTitle(titleOnError || trimmedTitle);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: completedTodos.length === todos.length,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={creating ? titleOnError : title}
          onChange={handleTitleChange}
          disabled={creating}
          ref={titleField}
        />
      </form>
    </header>
  );
};
