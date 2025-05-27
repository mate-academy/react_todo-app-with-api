type Props = {
  title: string;
  onTitleChange: (value: string) => void;
  onAdd: (event: React.FormEvent) => void;
  inputRef: React.Ref<HTMLInputElement>;
  disabled?: boolean;
  allCompleted: boolean;
  toggleAll: () => void;
  disabledToggleAll: boolean;
  isVisible: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  onTitleChange,
  onAdd,
  inputRef,
  disabled,
  allCompleted,
  toggleAll,
  disabledToggleAll,
  isVisible,
}) => (
  <header className="todoapp__header">
    {isVisible && (
      <button
        type="button"
        data-cy="ToggleAllButton"
        className={`todoapp__toggle-all${allCompleted ? ' active' : ''}`}
        onClick={toggleAll}
        disabled={disabledToggleAll}
        aria-pressed={allCompleted}
      ></button>
    )}

    <form onSubmit={onAdd}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        ref={inputRef}
        disabled={disabled}
      />
    </form>
  </header>
);
