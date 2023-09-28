/* eslint-disable jsx-a11y/control-has-associated-label */

import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  onSubmit: (todo: Todo) => Promise<void>;
  todos: Todo[];
  setErrorMessage: (message: string) => void;
  userId: number;
  isFocused: boolean;
  newTitle: string;
  setNewTitle: (title: string) => void;
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  onSubmit,
  setErrorMessage = () => { },
  userId,
  isFocused,
  newTitle,
  setNewTitle = () => { },
  toggleAll = () => { },
}) => {
  // #region state
  const inputReference = useRef<HTMLInputElement | null>(null);
  const amountCompletedTodo = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    if (inputReference.current && isFocused) {
      inputReference.current.focus();
    }
  }, [isFocused]);
  // #endregion

  // #region handlers
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    onSubmit({
      id: 0, userId, title: newTitle.trim(), completed: false,
    });
  };
  // #endregion

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          onClick={() => toggleAll()}
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: amountCompletedTodo === todos.length,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          disabled={!isFocused}
          ref={inputReference}
          onChange={handleTitleChange}
          value={newTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
