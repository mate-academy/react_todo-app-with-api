import { RefObject } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  newTodoField: RefObject<HTMLInputElement>,
  title: string,
  isDisabled: boolean,
  setTitle: (todoText: string) => void,
  changeStatusAll: () => void
  todos: Todo[]
};

export const Header: React.FC<Props> = ({
  handleSubmit,
  newTodoField,
  title,
  isDisabled,
  setTitle,
  changeStatusAll,
  todos,
}) => {
  const completedTodosAll = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        aria-label="make all todos active or vice versa"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: completedTodosAll,
        })}
        onClick={changeStatusAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
