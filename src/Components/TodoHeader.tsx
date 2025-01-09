import { useState, useEffect } from 'react';
import cn from 'classnames';

type Props = {
  todoTitleRef: React.RefObject<HTMLInputElement> | null;
  onAddTodo: (title: string) => Promise<boolean>;
  onToggleAllTodos: () => void;
  isLoading: boolean;
  isAllTodoCompleted: boolean;
  isTodoListNotEmpty: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todoTitleRef,
  onAddTodo,
  onToggleAllTodos,
  isLoading,
  isAllTodoCompleted,
  isTodoListNotEmpty,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = todoTitle.trim();

    const success = await onAddTodo(trimmedTitle);

    if (success) {
      setTodoTitle('');
    }
  };

  useEffect(() => {
    if (!isLoading) {
      todoTitleRef?.current?.focus();
    }
  }, [todoTitleRef, isLoading]);

  return (
    <header className="todoapp__header">
      {isTodoListNotEmpty && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllTodoCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggleAllTodos}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoTitleRef}
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
