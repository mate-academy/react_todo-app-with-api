import classNames from 'classnames';
import { FC, FormEvent, memo, useCallback, useEffect, useMemo } from 'react';
import { Todo } from '../types';
import React from 'react';

type Props = {
  isLoading: boolean;
  todos: Todo[];
  titleRef: React.RefObject<HTMLInputElement>;
  onShowError: (err: string) => void;
  onFormSubmit: (title: Todo['title']) => void;
  onUpdate: (todo: Todo) => void;
};

export const Header: FC<Props> = memo(
  ({ isLoading, todos, titleRef, onShowError, onFormSubmit, onUpdate }) => {
    useEffect(() => {
      titleRef.current?.focus();
    });

    const isAllTodosCompleted = useMemo(
      () => todos.every(({ completed }) => completed),
      [todos],
    );

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fieldValue = titleRef.current?.value?.trim();

      if (!fieldValue) {
        onShowError('Title should not be empty');

        return;
      }

      onFormSubmit(fieldValue);
    };

    const handleToggleTodos = useCallback(() => {
      if (isAllTodosCompleted) {
        todos.forEach(todo => {
          onUpdate({ ...todo, completed: !todo.completed });
        });
      }

      todos
        .filter(({ completed }) => !completed)
        .forEach(todo => onUpdate({ ...todo, completed: !todo.completed }));
    }, [isAllTodosCompleted, onUpdate, todos]);

    return (
      <header className="todoapp__header">
        {todos.length ? (
          <button
            type="button"
            className={classNames('todoapp__toggle-all ', {
              active: isAllTodosCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={handleToggleTodos}
          />
        ) : null}

        <form onSubmit={handleFormSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={titleRef}
            disabled={isLoading}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'HeaderMemo';
