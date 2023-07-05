import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface HeaderProps {
  todos: Todo[],
  title: string,
  isDisabled: boolean,
  handleTodoUpdate: (todoId: number, data: any) => void,
  handleChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void | NodeJS.Timeout,
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  title,
  isDisabled,
  handleChangeTitle,
  handleTodoUpdate,
  handleSubmit,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabled) {
      return;
    }

    setTimeout(() => {
      if (titleField.current) {
        titleField.current.focus();
      }
    }, 400);
  }, [isDisabled]);

  const handleMultipleToggleTodoComplete = () => {
    return todos.filter(todo => todo.completed).length < todos.length
      ? todos
        .filter(todo => todo.completed === false)
        .map(todo => handleTodoUpdate(todo.id, { completed: !todo.completed }))
      : todos
        .map(todo => handleTodoUpdate(todo.id, { completed: !todo.completed }));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="To complete all todos"
        className={classNames('todoapp__toggle-all', {
          active: todos.filter(todo => todo.completed).length === todos.length,
        })}
        onClick={handleMultipleToggleTodoComplete}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          ref={titleField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isDisabled}
          onChange={handleChangeTitle}
        />
      </form>
    </header>
  );
};
