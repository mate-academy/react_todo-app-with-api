import React from 'react';

import { ErrorType } from '../../types/ErrorType';

type Props = {
  title: string,
  onTitleChange: (newTitle: string) => void,
  isInputEnabled: boolean,
  showError: (message: ErrorType) => void,
  onAddTodo: (title: string) => void,
};

export const AddTodoForm: React.FC<Props> = ({
  title,
  onTitleChange,
  showError,
  isInputEnabled,
  onAddTodo,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const preparedTitle = title.trim();

    if (preparedTitle.length === 0) {
      showError(ErrorType.EMPTY_TITLE);
      onTitleChange('');
    } else {
      onAddTodo(preparedTitle);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={handleTitleChange}
        disabled={!isInputEnabled}
      />
    </form>
  );
};
