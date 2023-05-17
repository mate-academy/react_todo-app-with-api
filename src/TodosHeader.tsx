import React from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  todoAddQuery: string;
  onInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event:React.FormEvent) => void;
  disableInput: boolean;
  todos: Todo[];
  onToggle: () => void;
};

export const TodosHeader:React.FC<Props> = ({
  todoAddQuery,
  onInput,
  onSubmit,
  disableInput,
  todos,
  onToggle,
}) => {
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          aria-label="toggle all active todos"
          onClick={onToggle}
        />
      )}

      <form
        onSubmit={(event) => onSubmit(event)}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoAddQuery}
          disabled={disableInput}
          onChange={event => onInput(event)}
        />
      </form>
    </header>
  );
};
