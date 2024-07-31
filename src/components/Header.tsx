/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todos: Todo[];
  activeTodos: Todo[];
  updateStatusAllTodo: () => void;
  onSubmit: (todo: Todo) => Promise<void>;
  userId: number;
  onError: (error: string) => void;
  onSubmitTempTodo: (todo: Todo | null) => void;
  processingIds: number[];
};

export const Header: React.FC<Props> = ({
  todos,
  activeTodos,
  updateStatusAllTodo,
  onSubmit,
  userId,
  onError,
  onSubmitTempTodo,
  processingIds,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleField.current?.focus();
  }, [processingIds.length]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalisedTitle = title.trim();

    if (!normalisedTitle) {
      onError(ErrorMessage.titleEmpty);

      return;
    }

    setIsSubmiting(true);

    const tempTodo = { userId, completed: false, title: normalisedTitle };

    const newTodo = {
      userId,
      completed: false,
      title: normalisedTitle,
      id: +new Date(),
    };

    onSubmitTempTodo({
      id: 0,
      ...tempTodo,
    });
    onSubmit(newTodo)
      .then(() => {
        setTitle('');
      })
      .catch(() => {
        onError(ErrorMessage.addTodo);
      })
      .finally(() => {
        setIsSubmiting(false);
        onSubmitTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodos.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={updateStatusAllTodo}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          ref={titleField}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
