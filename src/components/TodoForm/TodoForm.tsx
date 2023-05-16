/* eslint-disable jsx-a11y/control-has-associated-label */

import { ChangeEvent, FC, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  tempTodo: Todo | null;
  countOfActiveTodos: number;
  addTodo: (query: string) => void;
  updateStatusOfAllTodo: () => void;
}

export const TodoForm: FC<Props> = ({
  tempTodo,
  countOfActiveTodos,
  addTodo,
  updateStatusOfAllTodo,
}) => {
  const [query, setQuery] = useState('');

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmitForm = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">

      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !countOfActiveTodos,
        })}
        onClick={updateStatusOfAllTodo}
      />

      <form onSubmit={handleSubmitForm}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChangeInput}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
