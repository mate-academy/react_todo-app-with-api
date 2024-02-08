import classNames from 'classnames';
import {
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';

interface Props {
  addTempTodo: (title: string) => void;
  disabled: boolean;
  toggleAllTodos: () => void,
  allCompleted: boolean,
  todos: Todo[],
}

export const Header: React.FC<Props> = memo(({
  addTempTodo,
  disabled,
  toggleAllTodos,
  allCompleted,
  todos,
}) => {
  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  useEffect(() => {
    if (!disabled) {
      setTitle('');
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTempTodo(title);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggleAll"
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompleted,
        })}
        data-cy="ToggleAllButton"
        style={{ display: todos.length > 0 ? 'flex' : 'none' }}
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
