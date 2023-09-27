import React, {
  useContext, useEffect, useRef,
} from 'react';
import classNames from 'classnames';
import { TodoContext } from '../../context/TodoContext';
import { ErrorEnum } from '../../types/Error';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const TodoHeader: React.FC = () => {
  const {
    visibleTodos,
    activeTodosAmount,
    setError,
    title,
    addTodoAction,
    setTitle,
    isLoading,
    toggleAllStatus,
  } = useContext(TodoContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim()) {
      addTodoAction(title);
    } else {
      setError(ErrorEnum.titleNotEmpty);
    }
  };

  return (
    <header className="todoapp__header">
      {visibleTodos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodosAmount === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllStatus}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={isLoading}
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
