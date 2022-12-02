import classNames from 'classnames';
import React, { useCallback, useState } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>
  setErrorMessage: (message: string) => void
  addNewTodo: (title: string) => Promise<void>
  isAdding: boolean
  toggleAllTodosStatus: () => Promise<void>
  todosLength: number
  completedTodosLen: number
};

export const Header: React.FC<Props> = React.memo(({
  newTodoField,
  setErrorMessage,
  addNewTodo,
  isAdding,
  toggleAllTodosStatus,
  todosLength,
  completedTodosLen,
}) => {
  const [title, setTitle] = useState('');

  const isAllCompleted = completedTodosLen === todosLength;

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('ToDo title can`t be empty!');

      return;
    }

    addNewTodo(title);
    setTitle('');
  }, [title]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
          hidden: todosLength < 1,
        })}
        aria-label="Toggle All"
        onClick={toggleAllTodosStatus}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
