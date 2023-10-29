import React, {
  useContext, useEffect, useRef,
} from 'react';
import classNames from 'classnames';
import { TodoContext } from '../../context/TodoContext';
import { ErrorEnum } from '../../types/Error';

export const TodoHeader: React.FC = () => {
  const {
    todos,
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
      {todos.length > 0 && (
        <button
          aria-label="toggle-all-button"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !activeTodosAmount,
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
