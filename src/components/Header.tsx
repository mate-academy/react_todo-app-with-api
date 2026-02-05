import React from 'react';
import classNames from 'classnames';
import { NewTodoForm } from './NewTodoForm';
import { ErrorMessage } from '../App';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  title: string;
  setTitle: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  tempTodo: Todo | null;
  inputRef: React.RefObject<HTMLInputElement>;
  error: ErrorMessage;
  setError: React.Dispatch<React.SetStateAction<ErrorMessage>>;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  title,
  setTitle,
  onSubmit,
  tempTodo,
  inputRef,
  error,
  setError,
  onToggleAll,
}) => {
  const isAllCompleted = todos.every(todo => todo.completed);

  const toggleAllClass = classNames('todoapp__toggle-all', {
    active: isAllCompleted,
  });

  return (
    <header className="todoapp__header">
      {Boolean(todos.length) && (
        <button
          type="button"
          className={toggleAllClass}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <NewTodoForm
        title={title}
        setTitle={setTitle}
        onSubmit={onSubmit}
        disabled={!!tempTodo}
        inputRef={inputRef}
        error={error}
        setError={setError}
      />
    </header>
  );
};
