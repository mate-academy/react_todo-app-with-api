import classNames from 'classnames';
import { useEffect, useRef } from 'react';

type Props = {
  isToggleAllVisible: boolean;
  isToggleAllActive: boolean;
  onSubmit: (title: string) => void;
  todoAddStatus?: TodoAddOperationStatus;
  focusTrigger: boolean;
  handleToggleAll: () => void;
};

export enum TodoAddOperationStatus {
  LOADING,
  SUCCESS,
  ERROR,
}

export const Header: React.FC<Props> = ({
  isToggleAllVisible,
  isToggleAllActive,
  onSubmit,
  todoAddStatus = TodoAddOperationStatus.SUCCESS,
  focusTrigger,
  handleToggleAll,
}) => {
  const inputField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (
      todoAddStatus === TodoAddOperationStatus.SUCCESS &&
      inputField.current
    ) {
      inputField.current.value = '';
    }
  }, [todoAddStatus]);

  useEffect(() => {
    inputField.current?.focus();
  }, [focusTrigger]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // TODO!: do this the right way?
    onSubmit((event.currentTarget.elements[0] as HTMLInputElement).value);
  }

  return (
    <header className="todoapp__header">
      {isToggleAllVisible && (
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
          ref={inputField}
          disabled={todoAddStatus === TodoAddOperationStatus.LOADING}
        />
      </form>
    </header>
  );
};
