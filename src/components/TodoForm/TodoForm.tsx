import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>;
  addTodoToServer: (todoTitle: string) => void;
  isAdding: boolean;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  toggleAllTodosServerStatus: () => Promise<void>;
  isAllTodosCompleted: boolean;
  isToggleVisible: boolean;
}

export const TodoForm: React.FC<Props> = React.memo(({
  newTodoField,
  addTodoToServer,
  isAdding,
  setHasError,
  setErrorMessage,
  toggleAllTodosServerStatus,
  isAllTodosCompleted,
  isToggleVisible,
}) => {
  const [todoText, setTodoText] = useState('');

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimedText = todoText.trim();

    if (trimedText === '') {
      setHasError(true);
      setErrorMessage('Title can\'t be empty');

      return;
    }

    addTodoToServer(trimedText);
  }, [todoText]);

  useEffect(() => {
    if (!isAdding) {
      setTodoText('');
    }
  }, [isAdding]);

  return ((
    <header className="todoapp__header">
      {isToggleVisible && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          aria-label="Toggle all todos"
          onClick={toggleAllTodosServerStatus}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          value={todoText}
          onChange={handleInput}
          disabled={isAdding}
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  ));
});
