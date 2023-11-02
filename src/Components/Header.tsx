import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  onSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void,
  title: string,
  setTitle: (t: string) => void,
  isDisabled: boolean,
  toggleAll: () => void,
}

export const Header: React.FC<Props> = ({
  todos,
  onSubmitForm,
  title,
  setTitle,
  isDisabled,
  toggleAll,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [isDisabled, todos.length]);

  const IsAllCompletedTodos = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: IsAllCompletedTodos })}
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          disabled={isDisabled}
          onClick={toggleAll}
        />
      )}
      <form
        method="Post"
        onSubmit={onSubmitForm}
      >
        <input
          data-cy="NewTodoField"
          ref={inputField}
          type="text"
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
