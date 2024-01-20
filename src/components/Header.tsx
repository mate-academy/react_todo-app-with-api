import {
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  addTempTodo: (title: string) => void,
  disabled: boolean,
  toggleAllTodos: () => void,
  allCompleted: boolean,
}

export const Header: React.FC<Props> = memo(({
  addTempTodo,
  disabled,
  toggleAllTodos,
  allCompleted,
}) => {
  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTempTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">

      <button
        aria-label="toggleAll"
        type="button"
        className={`todoapp__toggle-all ${allCompleted && 'active'}`}
        data-cy="ToggleAllButton"
        onClick={toggleAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          disabled={disabled}
        />
      </form>
    </header>
  );
});
