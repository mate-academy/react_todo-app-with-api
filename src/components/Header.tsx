import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  isToggleVisible: boolean;
  isToggleAllActive: boolean;
  isUpdating: boolean;
  titleInputRef: React.RefObject<HTMLInputElement>;
  onSubmit: () => void;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  isToggleVisible,
  isToggleAllActive,
  isUpdating,
  titleInputRef,
  onSubmit = () => {},
  onToggleAll,
}) => {
  useEffect(() => {
    titleInputRef?.current?.focus();
  }, [titleInputRef, isUpdating]);

  const handleSubmit = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    onSubmit();
  };

  const handleToggleAll = () => {
    onToggleAll();
  };

  return (
    <header className="todoapp__header">
      {isToggleVisible && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isToggleAllActive,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleInputRef}
          disabled={isUpdating}
        />
      </form>
    </header>
  );
};
