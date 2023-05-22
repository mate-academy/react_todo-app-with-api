interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  onChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  title: string;
  isInputDisabled: boolean,
}

export const Header: React.FC<Props> = ({
  onSubmit,
  onChangeTitle,
  title,
  isInputDisabled,
}) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Toggle All"
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
