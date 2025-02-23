import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { USER_ID } from '../../api';

import { Todo, ErrorType } from '../../types';

interface Props {
  setError: (e: string) => void;
  onCreate: (todo: Omit<Todo, 'id'>) => Promise<void>;
  isSubmitting: boolean;
  shouldFocusInput: boolean;
  setShouldFocusInput: (value: boolean) => void;
  onUpdate: (todo: Todo) => Promise<void>;
  todos: Todo[];
}

export const Header: React.FC<Props> = ({
  setError,
  onCreate,
  isSubmitting,
  shouldFocusInput,
  setShouldFocusInput,
  onUpdate,
  todos,
}) => {
  const [title, setTitle] = useState('');
  const [shouldFocus, setShouldFocus] = useState(false);
  const [requestError, setRequestError] = useState(false);

  const inputElement = useRef<HTMLInputElement | null>(null);

  function reset() {
    setTitle('');
  }

  function onSubmitTodo(event: React.FormEvent) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle.length) {
      setError(ErrorType.EMPTY_TITLE);
      setTimeout(() => setError(''), 3000);

      return;
    }

    setTitle(trimmedTitle);

    onCreate({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(() => {
        reset();
        setShouldFocus(true);
        setRequestError(false);
        setShouldFocusInput(true);
      })
      .catch(() => {
        setRequestError(true);
      });
  }

  const changeStatus = (status: boolean) => {
    const changedTodos: Promise<void>[] = [];

    todos.forEach(todo => {
      if (todo.completed !== status) {
        changedTodos.push(onUpdate({ ...todo, completed: status }));
      }
    });

    Promise.allSettled(changedTodos);
  };

  const handleAllTodos = () => {
    const hasSomeActiveTodo = todos.some(todo => !todo.completed);

    return changeStatus(hasSomeActiveTodo);
  };

  const completedTodos = todos.every(todo => todo.completed);

  //#region focus
  useEffect(() => {
    if (shouldFocusInput && inputElement.current) {
      inputElement.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  useEffect(() => {
    if (shouldFocus && inputElement.current) {
      inputElement.current.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  useEffect(() => {
    if (requestError) {
      setShouldFocus(true);
    }
  }, [requestError]);

  useEffect(() => {
    if (shouldFocus) {
      inputElement.current?.focus();
    }
  }, [shouldFocus]);
  //#endregion focus

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: completedTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={handleAllTodos}
        />
      )}

      <form onSubmit={onSubmitTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          ref={inputElement}
          autoFocus
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
