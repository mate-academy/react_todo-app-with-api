import classNames from 'classnames';
import { FormEvent, FC, useEffect } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  handleToggleClick: () => void;
  handleSubmit: (event: FormEvent) => void;
  newTodoField: React.RefObject<HTMLInputElement>;
  isCompleted: boolean;
  isAdding: boolean;
  title: string;
  setTitle: ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Header: FC<Props> = ({
  todos,
  handleToggleClick,
  handleSubmit,
  newTodoField,
  isCompleted,
  isAdding,
  title,
  setTitle,
}) => {
  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isCompleted },
          )}
          onClick={handleToggleClick}
        />

      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={setTitle}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
