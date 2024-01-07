import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onToggleAll: () => void;
}

export const ToggleAll: React.FC<Props> = ({ onToggleAll, todos }) => {
  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: todos.every(todo => !todo.completed),
      })}
      data-cy="ToggleAllButton"
      onClick={onToggleAll}
    >
      <span className="visually-hidden" />
    </button>
  );
};
