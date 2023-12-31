import React, { useEffect, useRef } from 'react';

import { Todo } from '../../types/Todo';
import { USER_ID } from '../../helpers/userId';

type Props = {
  onDeleteCompletedTodos: (value: Todo[]) => void,
  onErrorMessage: (value: string) => void,
  onSubmit: (value: Todo) => Promise<void>,
  onQuery: (value: string) => void,
  onDelete: (value: number) => void,

  updateInputFocus: boolean,
  isInputDisabled: boolean,
  query: string,
};

export const TodoForm: React.FC<Props> = ({
  onDeleteCompletedTodos,
  onErrorMessage,
  onSubmit,
  onQuery,
  onDelete,

  updateInputFocus,
  isInputDisabled,
  query,
}) => {
  const textField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textField.current && !updateInputFocus) {
      textField.current.focus();
    }
  }, [
    onDeleteCompletedTodos,
    onDelete,
    updateInputFocus,
    isInputDisabled,
  ]);

  const pattern = /[\p{L}\p{N}\p{S}]+/gu;

  const reset = () => {
    onQuery('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    onErrorMessage('');

    event.preventDefault();

    if (!query || !pattern.test(query)) {
      onErrorMessage('Title should not be empty');

      return;
    }

    onSubmit({
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    }).then(reset)
      .catch((error) => error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isInputDisabled}
        ref={textField}
        value={query}
        onChange={(event) => onQuery(event.target.value)}
      />
    </form>
  );
};
