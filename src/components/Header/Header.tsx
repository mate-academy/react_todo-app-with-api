import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { ERROR_MESSAGES } from '../../App';

type Props = {
  clearErrorMessage: () => void;
  setErrorMessage: (errorMessage: string) => void;
  addTodo: (title: string) => Promise<Todo | void>;
  todos: Todo[];
  notCompletedTodos: Todo[];
  onToggleAllTodos: () => void;
};

const HeaderBase: React.FC<Props> = ({
  setErrorMessage,
  clearErrorMessage,
  addTodo,
  todos,
  notCompletedTodos,
  onToggleAllTodos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const newTodoInput = useRef<HTMLInputElement | null>(null);

  const handleChangeTodoTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
    clearErrorMessage();
  };

  const clearForm = () => {
    setTodoTitle('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = todoTitle.trim();

    if (title === '') {
      setErrorMessage(ERROR_MESSAGES.emptyTitle);

      return;
    }

    setIsLoading(true);
    addTodo(title)
      .then(clearForm)
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    newTodoInput.current?.focus();
  }, [isLoading, todos]);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          onClick={onToggleAllTodos}
          type="button"
          className={cn('todoapp__toggle-all', {
            active: notCompletedTodos.length === 0,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChangeTodoTitle}
          value={todoTitle}
          ref={newTodoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
      </form>
    </header>
  );
};

export const Header = React.memo(HeaderBase);
