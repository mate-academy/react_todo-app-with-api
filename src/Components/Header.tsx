import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  onChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  title: string;
  isInputDisabled: boolean,
  handleToggleAll: () => void;
  activeTodos: Todo[]
}

export const Header: React.FC<Props> = ({
  onSubmit,
  onChangeTitle,
  title,
  isInputDisabled,
  handleToggleAll,
  activeTodos,
}) => {
  return (
    <header className="todoapp__header">
      <button
        onClick={handleToggleAll}
        type="button"
        aria-label="Toggle All"
        className={classNames('todoapp__toggle-all', {
          active: activeTodos.length === 0,
        })}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={(e) => onSubmit(e)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => onChangeTitle(e)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
