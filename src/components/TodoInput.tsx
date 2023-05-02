import classNames from 'classnames';
import { FC, FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  itemsCompleted: Todo[];
  addTodo: (title: string) => void;
  onToggleAll: () => void;
  todos: Todo[];
  isInputDisabled: boolean;
}

export const TodoInput: FC<Props> = ({
  itemsCompleted,
  addTodo,
  onToggleAll,
  todos,
  isInputDisabled,
}) => {
  const [title, setTitle] = useState('');

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    addTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: itemsCompleted.length === 0,
          disable: todos.length === 0,
        })}
        aria-label="toggle-button"
        onClick={onToggleAll}
        disabled={isInputDisabled}
      />

      <form onSubmit={handleFormSubmit}>
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
