import cn from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';
import { useCallback, useEffect, useRef } from 'react';

type Props = {
  addTodo: (title: string) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  isDisabled: boolean;
  todos: Todo[];
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  toggleAllTodo: () => void;
};

export const Header: React.FC<Props> = ({
  addTodo,
  setErrorMessage,
  isDisabled,
  todos,
  title,
  setTitle,
  toggleAllTodo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  const handleSubmit = useCallback(() => {
    if (!title.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    addTodo(title.trim());
  }, [addTodo, setErrorMessage, title]);

  const allCompleted: boolean = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
        onClick={toggleAllTodo}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isDisabled}
          autoFocus
        />
      </form>
    </header>
  );
};
