import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  handleToggleAll: () => void,
  addTodo: (title: string) => void,
  todos: Todo[];
  notCompletedTodosCount: number,
  isDisabled: boolean,
};

export const TodoHeader: React.FC<Props> = ({
  handleToggleAll,
  todos,
  addTodo,
  isDisabled,
  notCompletedTodosCount,
}) => {
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodo !== '') {
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button // eslint-disable-line
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: notCompletedTodosCount === 0 })}
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={({ target }) => setNewTodo(target.value)}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
