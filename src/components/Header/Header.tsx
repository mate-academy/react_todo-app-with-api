import React, { useState } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';

interface Props {
  addTodo: (title: string) => void;
  setEmptyTitleError?: (message: ErrorMessage) => void;
  allTodosCompleted: boolean;
  onToggleAll: (completed: boolean) => void;
  todos: Todo[];
}

export const Header: React.FC<Props> = ({
  addTodo,
  setEmptyTitleError,
  allTodosCompleted,
  onToggleAll,
  todos,
}) => {
  const [newTodo, setNewTodo] = useState('');

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    } else {
      setEmptyTitleError?.(ErrorMessage.EmptyTitle);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleToggleAll = () => {
    const newCompletedStatus = !allTodosCompleted;

    onToggleAll(newCompletedStatus);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          onClick={handleToggleAll}
          disabled={!allTodosCompleted}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
