import classNames from 'classnames';

interface Props {
  onTodoSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleToggleAll: () => void;
  isAllCompleted: boolean;
  isToggleButtonHidden: boolean;
}

export const Header: React.FC<Props> = ({
  onTodoSubmit,
  newTodoTitle,
  setNewTodoTitle,
  inputRef,
  isDisabled,
  handleToggleAll,
  isAllCompleted,
  isToggleButtonHidden,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!isToggleButtonHidden && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onTodoSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={newTodoTitle}
          disabled={isDisabled}
          onChange={e => {
            setNewTodoTitle(e.target.value);
          }}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
        />
      </form>
    </header>
  );
};
