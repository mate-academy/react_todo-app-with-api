import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/extensions
import { Todo } from '../../types/Todo';

type Props = {
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  showError: (error: string) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>; // 1. Принимаем ref снаружи
};

export const Header: React.FC<Props> = ({
  addTodo,
  showError,
  isLoading,
  inputRef, // Получаем его здесь
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, inputRef]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      showError('Title should not be empty');

      return;
    }

    addTodo({
      userId: 0,
      title: title.trim(),
      completed: false,
    })
      .then(() => {
        setTitle('');
      })
      .catch(() => {
        // Error is handled in App
      });
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          disabled={isLoading}
          ref={inputRef} // 2. Привязываем полученный ref
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};
