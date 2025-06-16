import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onSubmit: (title: string) => Promise<boolean>;
  isLoading: boolean;
  onToggleAllCompleted: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  onSubmit,
  isLoading,
  onToggleAllCompleted,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const isAllTodosCompleted = todos.every(todo => todo.completed);
  const isAnyTodos = !!todos.length;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isSuccess = await onSubmit(todoTitle);

    if (isSuccess) {
      setTodoTitle('');
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {isAnyTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAllCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
