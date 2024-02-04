/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import { USER_ID } from '../constants';
import { createTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const [shouldNotFocusInput, setShouldNotFocusInput] = useState(true);

  const myInput = React.createRef<HTMLInputElement>();

  const {
    loadingAllTodos,
    setLoadingAllTodos,
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
    loadingTodo,
    setLoadingTodo,
  } = useContext(TodoContext);

  useEffect(() => {
    if (myInput.current && shouldNotFocusInput) {
      myInput.current.focus();
    }
  }, [loadingTodo, loadingAllTodos, myInput]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    setTempTodo({
      id: 0,
      title,
      completed: false,
    });

    const trimmedTitle = title.trim();

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setLoadingTodo(newTodo as Todo);

    createTodo(newTodo)
      .then((createdTodo: Todo) => {
        setTodos((prev) => [...prev, createdTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setLoadingTodo(null);
        setTempTodo(null);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  const uncompletedTodos = todos.filter((t) => !t.completed).map((t) => t.id);

  const handleToggleTodos = async (ids: number[]) => {
    setLoadingAllTodos(true);
    setShouldNotFocusInput(false);

    try {
      if (ids.length > 0) {
        await Promise.all(ids.map((id) => updateTodo(id, { completed: true })));
        setTodos((prev) => prev.map((todo) => ({ ...todo, completed: true })));
      } else {
        await Promise.all(todos.map(
          (t) => updateTodo(t.id, { completed: false }),
          ));
        setTodos((prev) => prev.map((todo) => ({ ...todo, completed: false })));
      }
    } catch (error) {
      setErrorMessage('Unable to toggle todos');
    } finally {
      setLoadingAllTodos(false);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: uncompletedTodos.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleToggleTodos(uncompletedTodos)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          ref={myInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitleChange}
          disabled={loadingAllTodos || !!loadingTodo}
        />
      </form>
    </header>
  );
};
