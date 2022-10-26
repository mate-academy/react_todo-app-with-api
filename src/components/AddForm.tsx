import { FormEvent, useEffect, useRef } from 'react';

type Props = {
  title: string;
  setTitle: (value: string) => void;
  handleSubmit: (event: FormEvent) => Promise<void>;
  isAdding: boolean;
  handleToggleAll: () => void;
};

export const AddForm: React.FC<Props> = ({
  title,
  setTitle,
  handleSubmit,
  isAdding,
  handleToggleAll,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="close"
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
