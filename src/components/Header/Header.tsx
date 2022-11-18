import React, { useEffect, useState } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>;
  addTodoToServer: (newTodoTitle: string) => void;
  isTodoBeingAdded: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  todosLength: number;
  updateAll: () => Promise<void>;
}

export const Header: React.FC<Props> = React.memo(({
  newTodoField,
  addTodoToServer,
  isTodoBeingAdded,
  setErrorMessage,
  todosLength,
  updateAll,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (trimmedTitle === '') {
      setErrorMessage('Please enter what needs to be done');

      return;
    }

    addTodoToServer(trimmedTitle);
  };

  useEffect(() => {
    if (!isTodoBeingAdded) {
      setTodoTitle('');
    }
  }, [isTodoBeingAdded]);

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
          aria-label="Toggle all todos button"
          onClick={updateAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTitleInput}
          disabled={isTodoBeingAdded}
        />
      </form>
    </header>
  );
});
