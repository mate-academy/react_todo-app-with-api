/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  input: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  numActiveTodos: number;
  handleToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  input,
  handleSubmit,
  handleChange,
  numActiveTodos,
  handleToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${!numActiveTodos && 'active'}`}
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={input}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
