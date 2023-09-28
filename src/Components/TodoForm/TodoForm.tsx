import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  todos: number;
  value: string;
  setValue: (value: string) => void;
  handleSubmit: (event: React.ChangeEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  isAllCompleted: boolean,
  toggleAll: () => void,
};

export const TodoForm: React.FC<Props> = ({
  todos,
  value,
  setValue,
  handleSubmit,
  isSubmitting,
  inputRef,
  isAllCompleted,
  toggleAll,
}) => {
  useEffect(() => {
    if (!isSubmitting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting]);

  return (
    <header className="todoapp__header">
      {todos !== 0 && (
        <button
          type="button"
          aria-label="todo do"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="What needs to be done?"
          disabled={isSubmitting}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
