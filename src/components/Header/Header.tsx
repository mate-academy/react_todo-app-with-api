import React, {
  memo,
  FormEvent,
  useEffect,
  useRef,
} from 'react';

type Props = {
  onAddTodo: (title: string) => void,
  todoTitle: string,
  setTodoTitle: (todoTitle: string) => void,
  isBeingLoading: boolean,
  showExpendIcon: boolean,
  onStatusAll: () => void,
};

export const Header: React.FC<Props> = memo(({
  onAddTodo,
  todoTitle,
  setTodoTitle,
  isBeingLoading,
  showExpendIcon,
  onStatusAll,
}) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onAddTodo(todoTitle);
  };

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isBeingLoading]);

  return (
    <header className="todoapp__header">
      {showExpendIcon
        && (
          <button
            aria-label="toggle all active button"
            type="button"
            className="todoapp__toggle-all active"
            onClick={() => onStatusAll()}
          />
        )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isBeingLoading}
        />
      </form>
    </header>
  );
});
