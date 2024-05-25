import React from 'react';
import { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  addTodo: (todoTitle: string) => void;
  title: string;
  setTitle: (title: string) => void;
  isLoading: boolean;
  handleToggleAllStatus: () => void;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  addTodo,
  title,
  setTitle,
  isLoading,
  handleToggleAllStatus,
  todos,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const everyTodoCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(title);
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: everyTodoCompleted })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllStatus}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          disabled={isLoading}
          value={title}
          onChange={handleTitle}
        />
      </form>
    </header>
  );
};
