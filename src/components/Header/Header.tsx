import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  onAddNewTodo: (newTodoTitle: string) => Promise<void>,
  onToggleAll: () => void,
  isActiveToggle: boolean,
  todos: Todo[],
};

export const Header:React.FC<Props> = React.memo(({
  onAddNewTodo,
  onToggleAll,
  isActiveToggle,
  todos,
}) => {
  const [title, setTitle] = useState('');
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setDisabled(true);
      await onAddNewTodo(title);
    } finally {
      setTitle('');
      setDisabled(false);
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          aria-label="toggle"
          type="button"
          onClick={onToggleAll}
          className={classNames('todoapp__toggle-all', {
            active: isActiveToggle,
          })}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
});
