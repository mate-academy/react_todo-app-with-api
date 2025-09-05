import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { updateTodos } from '../api/todos';

type Props = {
  onSubmit: (value: string) => Promise<void>;
  userTodos: Todo[];
  setUserTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsLoader: React.Dispatch<React.SetStateAction<string | number | null>>;
  focusSignal?: number;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  userTodos,
  setUserTodos,
  setIsLoader,
  focusSignal,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setDisabled] = useState(false);
  const [areAllCompleted, setAreAllCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (focusSignal !== undefined) {
      inputRef.current?.focus();
    }
  }, [focusSignal]);

  useEffect(() => {
    const allCompleted =
      userTodos.length > 0 && userTodos.every(t => t.completed);

    setAreAllCompleted(allCompleted);
  }, [userTodos]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const toggleAllButton = async () => {
    if (userTodos.length === 0) {
      return;
    }

    const shouldComplete = !areAllCompleted;

    setIsLoader('all');

    const prevTodos = userTodos;
    const optimistic = prevTodos.map(t =>
      t.completed === shouldComplete ? t : { ...t, completed: shouldComplete },
    );

    setUserTodos(optimistic);

    try {
      const toUpdate = prevTodos.filter(t => t.completed !== shouldComplete);

      await Promise.all(
        toUpdate.map(t =>
          updateTodos({ id: t.id, completed: shouldComplete, title: t.title }),
        ),
      );
    } catch {
      setUserTodos(prevTodos);
    } finally {
      setIsLoader(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();

    setDisabled(true);
    try {
      await onSubmit(trimmed);
      if (trimmed) {
        setTitle('');
      }
    } finally {
      setDisabled(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const hasTodos = userTodos.length > 0;

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: areAllCompleted })}
          data-cy="ToggleAllButton"
          onClick={toggleAllButton}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isDisabled}
          autoFocus
        />
      </form>
    </header>
  );
};
