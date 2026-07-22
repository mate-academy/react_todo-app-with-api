import React, { FormEvent } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  title: string;
  isAdding: boolean;
  newTodoField: React.RefObject<HTMLInputElement | null>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleToggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  title,
  isAdding,
  newTodoField,
  setTitle,
  handleSubmit,
  handleToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isAdding}
          autoFocus
        />
      </form>
    </header>
  );
};
