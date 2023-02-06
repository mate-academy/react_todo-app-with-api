import { memo, useState } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  isLoading: boolean,
  onToggleAll: () => void
  toggledAlltodos:boolean;
  onAddTodo: (newTitle: string) => void,
};

export const Header: React.FC<Props> = memo(({
  newTodoField,
  isLoading,
  onAddTodo,
  onToggleAll,
  toggledAlltodos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onAddTodo(todoTitle);
    setTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={toggledAlltodos
          ? ('todoapp__toggle-all active')
          : ('todoapp__toggle-all')}
        onClick={onToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
