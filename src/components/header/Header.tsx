import { useState, useRef, useEffect } from 'react';

export const Header = ({
  addTodo,
  isSubmitting,
  areAllTodosCompleted,
  toggleAllTodos,
  todosCount,
}: {
  addTodo: (title: string) => Promise<void>;
  isSubmitting: boolean;
  areAllTodosCompleted: boolean;
  toggleAllTodos: () => Promise<void>;
  todosCount: number;
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addTodo(title);
      setTitle('');
    } catch {}
  };

  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${areAllTodosCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={formSubmitHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
