import React, { useState } from 'react';
import classNames from 'classnames';

type Props = {
  activeTodosLength: number,
  onSubmit: (title: string) => void,
  onToggleAll: (state: boolean) => void,
};

export const Header: React.FC<Props> = ({
  activeTodosLength, onSubmit, onToggleAll,
}) => {
  const [title, setTitle] = useState('');
  const [todoStatus, setTodoStatus] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit(title);
    setTitle('');
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleToggleAllTodos = () => {
    onToggleAll(!todoStatus);
    setTodoStatus(prev => !prev);
  };

  return (
    <header className="todoapp__header">
      {activeTodosLength > 0 && (
        /* eslint-disable jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todoStatus,
          })}
          onClick={handleToggleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
