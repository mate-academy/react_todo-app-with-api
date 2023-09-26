/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  itemsLeft: Todo[],
  handleToggleTodosAll: () => void,
  isLoading: boolean,
  inputHendlere: (event: React.ChangeEvent<HTMLInputElement>) => void,
  newTitle: string,
  addTodo: (event: React.FormEvent<HTMLFormElement>) => void,
};

export const Header: React.FC<Props> = ({
  itemsLeft,
  handleToggleTodosAll,
  isLoading,
  inputHendlere,
  newTitle,
  addTodo,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: itemsLeft.length === 0,
        })}
        onClick={handleToggleTodosAll}
      />
      <form onSubmit={(event) => addTodo(event)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={inputHendlere}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
