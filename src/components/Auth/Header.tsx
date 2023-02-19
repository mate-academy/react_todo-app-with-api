// import classNames from "classnames";

import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  isAdding: boolean;
  areTodosCompleted?: Todo | boolean;
  setStatusCompleted: () => void;
  setStatusNotCompleted:() => void;
};

export const Header: React.FC<Props> = ({
  value,
  setValue,
  handleKeyDown,
  isAdding,
  areTodosCompleted,
  setStatusCompleted,
  setStatusNotCompleted,
}) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        aria-label="button"
        type="button"
        onClick={areTodosCompleted ? setStatusCompleted : setStatusNotCompleted}
        className={classNames(
          'todoapp__toggle-all', { active: !areTodosCompleted },
        )}
      />

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          disabled={!isAdding}
          onChange={(e) => setValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
      </form>
    </header>
  );
};
