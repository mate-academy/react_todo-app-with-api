/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  memo, useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

export type Props = {
  onSubmit: (todo: Omit<Todo, 'id'>) => void
  showErrorMessage: (error: string) => void
  temporaryTodo: Todo | null
  toggleAllTodos: () => void
  visibleTogglerButton: boolean
};

export const Header: React.FC<Props> = memo(({
  onSubmit,
  showErrorMessage,
  temporaryTodo,
  toggleAllTodos,
  visibleTogglerButton,
}) => {
  const user = useContext(AuthContext);
  const [title, setTitle] = useState('');

  const newTodoField = useRef<HTMLInputElement>(null);

  const shouldDisableInput = temporaryTodo !== null;

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [onSubmit]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (user === null) {
      return;
    }

    if (!title.length) {
      showErrorMessage('Title can\'t be empty');

      return;
    }

    onSubmit({
      title,
      userId: user.id,
      completed: false,
    });

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: visibleTogglerButton },
        )}
        onClick={toggleAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={shouldDisableInput}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
});
