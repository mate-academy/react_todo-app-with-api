import React, { useCallback, useEffect, useState } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>;
  addTodoToServer: (todoTitle: string) => void;
  isAdding: boolean;
  generateError: (message: string) => void;
  toggleAllTodosStatusOnServer: () => Promise<void>;
}

export const TodoForm: React.FC<Props> = React.memo(({
  newTodoField,
  addTodoToServer,
  isAdding,
  generateError,
  toggleAllTodosStatusOnServer,
}) => {
  const [todoText, setTodoText] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (todoText.trim() === '') {
      generateError('Title can\'t be empty');

      return;
    }

    addTodoToServer(todoText);
  }, [todoText]);

  useEffect(() => {
    if (!isAdding) {
      setTodoText('');
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="ToggleAllButton"
        onClick={toggleAllTodosStatusOnServer}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          value={todoText}
          onChange={handleChange}
          disabled={isAdding}
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});
