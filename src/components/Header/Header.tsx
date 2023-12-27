/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  handleToggleAll: () => void;
  handleSubmit: (event: React.FormEvent) => void;
  title: string,
  isInputDisabled: boolean,
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  titleRef: React.RefObject<HTMLInputElement>,
};

export const Header: React.FC<Props> = ({
  todos,
  handleToggleAll,
  handleSubmit,
  title,
  isInputDisabled,
  handleTitleChange,
  titleRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all',
          { active: todos.every(todo => todo.completed) })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleRef}
          disabled={isInputDisabled}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
