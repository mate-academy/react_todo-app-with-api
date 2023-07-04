import classNames from 'classnames';

type Props = {
  amountOfActiveTodos: number,
  value: string,
  setValue: (value: string) => void,
  handleAddTodo: (event:
  React.FormEvent<HTMLFormElement>) => void,
  isLoading: boolean,
  handleSetAllCompleted: () => void;
};

export const Header: React.FC<Props> = ({
  amountOfActiveTodos,
  value,
  setValue,
  handleAddTodo,
  isLoading,
  handleSetAllCompleted,
}) => (
  <header className="todoapp__header">
    <button
      aria-label="none"
      type="button"
      className={classNames(
        'todoapp__toggle-all',
        {
          active: !amountOfActiveTodos,
        },
      )}
      onClick={() => handleSetAllCompleted}
    />

    <form onSubmit={handleAddTodo}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isLoading}
      />
    </form>
  </header>
);
