import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';

import { ErrorMessage } from '../../types/ErrorMessage';
import type { Todo } from '../../types/Todo';

interface Props {
  onAdd: (title: string) => Promise<void>;
  setTempTodo: (todo: Todo | null) => void;
  showErrorNotification: (error: ErrorMessage) => void;
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
  changeTodoStatus: (
    id: number,
    { completed }: Partial<Todo>,
  ) => Promise<void>;

}

export const Header: React.FC<Props> = React.memo((props) => {
  const {
    onAdd,
    setTempTodo,
    showErrorNotification,
    todos,
    changeTodoStatus,
    inputRef,
  } = props;

  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const areAllCompleted = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading, inputRef]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const preparedTitle = title.trim();

    if (!preparedTitle) {
      showErrorNotification(ErrorMessage.INPUT_ERROR);

      return;
    }

    setIsLoading(true);

    onAdd(preparedTitle)
      .then(() => setTitle(''))
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleToggleAll = () => {
    const newStatus = !areAllCompleted;

    todos.forEach(todo => {
      if (todo.completed !== newStatus) {
        changeTodoStatus(todo.id, { completed: newStatus });
      }
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: areAllCompleted },
          )}
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
