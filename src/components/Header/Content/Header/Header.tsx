import cn from 'classnames';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodosContext } from '../../../../Context/TodosContext';
import { Error } from '../../../../types/Error';

export const Header: React.FC = () => {
  const [message, setMessage] = useState('');
  const {
    handleErrorMessage,
    handleTodoAdd,
    isFieldDisabled,
    activeTodos,
    handleDisabled,
    toggleAll,
  } = useContext(TodosContext);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFieldDisabled) {
      titleField.current?.focus();
    }
  }, [titleField, isFieldDisabled]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleFocus = () => {
    handleDisabled(false);
  };

  const handleKeyDown = async (event: React.FormEvent) => {
    event.preventDefault();

    handleDisabled(true);

    if (!message.trim()) {
      handleErrorMessage(Error.Empty);
      handleDisabled(false);
    }

    if (message.trim()) {
      await handleTodoAdd({
        title: message,
        userId: 12151,
        completed: false,
      });

      handleDisabled(false);

      setMessage('');

      titleField.current?.focus();
    }

    titleField.current?.focus();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: !activeTodos.length,
        })}
        data-cy="ToggleAllButton"
        aria-label="Active"
        onClick={toggleAll}
      />

      <form onSubmit={handleKeyDown}>
        <input
          ref={titleField}
          type="text"
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          value={message}
          placeholder="What needs to be done?"
          onChange={handleChange}
          onBlur={handleFocus}
          disabled={isFieldDisabled}
        />
      </form>
    </header>
  );
};
