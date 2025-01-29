import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  hasTodos: boolean;
  allCompletedTodos: boolean;
  onAddTodo: (value: string) => Promise<void>;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  inputRef,
  hasTodos,
  allCompletedTodos,
  onAddTodo,
  onToggleAll,
}) => {
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.disabled = true;

      onAddTodo(inputElement.value)
        .then(() => {
          if (inputElement) {
            inputElement.value = '';
          }
        })
        .catch(() => {})
        .finally(() => {
          if (inputElement) {
            inputElement.disabled = false;
            inputElement.focus();
          }
        });
    }
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompletedTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
        />
      </form>
    </header>
  );
};
