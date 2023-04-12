import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  onSubmit: (title: string) => void,
  todos: Todo[],
  onToggleAll: () => void,
};

export const TodoHeader: React.FC<Props> = ({
  onSubmit,
  todos,
  onToggleAll,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todos.every(todo => todo.completed) },
        )}
        onClick={onToggleAll}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
