/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  onAdd: (title: string) => void,
  showError: (message: string) => void,
  toggleAllTodos: () => void,
  todoLength: number,
  completedTodos: Todo[],
};

export const Header: React.FC<Props> = ({
  onAdd,
  showError,
  todoLength,
  completedTodos,
  toggleAllTodos,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement>
    = (event) => {
      setTitle(event.target.value);
    };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      showError('Title can\'t be empty');

      return;
    }

    onAdd(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {todoLength && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: todoLength === completedTodos.length },
          )}
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
