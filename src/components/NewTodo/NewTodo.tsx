/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { useState } from 'react';
import { ErrorType } from '../../types/ErrorTypes';

interface P {
  uploadNewTodo: (title: string) => void;
  addError: (error: ErrorType) => void;
  isUploadingTitle: boolean;
  toggleAllTodosStatus: () => void;
  isAllCompleted: boolean;
}

export const NewTodo: React.FC<P> = ({
  uploadNewTodo,
  addError,
  isUploadingTitle,
  toggleAllTodosStatus,
  isAllCompleted,
}) => {
  const [title, setTitle] = useState('');
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      addError(ErrorType.EMPTYTITLE);

      return;
    }

    uploadNewTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        // className="todoapp__toggle-all active"
        className={classNames('todoapp__toggle-all',
          { active: isAllCompleted })}
        onClick={toggleAllTodosStatus}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isUploadingTitle}
        />
      </form>
    </header>
  );
};
