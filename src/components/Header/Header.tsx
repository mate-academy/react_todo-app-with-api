import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { USER_ID } from '../../api/todos';
import { TodoData } from '../../types/Todo';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  hasTodos: boolean,
  someActiveTodos: number,
  inProcessed: boolean,
  onSubmitAddTodo: (newTodo: TodoData) => void,
  onToggleUpdateTodos: (todoStatus: boolean) => void,
  showErrorMessage: (message: ErrorMessages) => void,
};

export const Header: React.FC<Props> = React.memo(({
  hasTodos,
  someActiveTodos,
  inProcessed,
  onSubmitAddTodo,
  onToggleUpdateTodos,
  showErrorMessage,
}) => {
  const [title, setTitle] = useState('');
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inProcessed) {
      setTitle('');
      titleField.current?.focus();
    }
  }, [inProcessed]);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimTitle = title.trim();

    if (!trimTitle) {
      showErrorMessage(ErrorMessages.EMPTY);

      return;
    }

    const newTodo = {
      title: trimTitle,
      userId: USER_ID,
      completed: false,
    };

    onSubmitAddTodo(newTodo);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          aria-label="toggle todo"
          className={cn('todoapp__toggle-all', {
            active: !someActiveTodos,
          })}
          onClick={() => onToggleUpdateTodos(!someActiveTodos)}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          ref={titleField}
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => setTitle(event.target.value)}
          disabled={inProcessed}
        />
      </form>
    </header>
  );
});
