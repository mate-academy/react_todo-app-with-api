import React, { forwardRef, useState } from 'react';

import { useEffect } from 'react';
import { Todo } from '../types/Todo';
import { errors } from '../constans/Errors';
import { USER_ID } from '../api/todos';
import classNames from 'classnames';

interface HeaderProps {
  todos: Todo[];
  setError: (error: string | null) => void;
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  loadingTodos: number[];
  setLoadingTodos: (loadingTodos: number[]) => void;
  onToggleAll: (completed: boolean) => void;
}
export const Header = forwardRef<HTMLInputElement, HeaderProps>(
  (
    {
      todos,
      setError,
      onSubmit,
      isSubmitting,
      setIsSubmitting,
      loadingTodos,
      setLoadingTodos,
      onToggleAll,
    },
    ref,
  ) => {
    const [newTodo, setNewTodo] = useState('');
    const reset = () => setNewTodo('');

    useEffect(() => {
      if (!isSubmitting && ref && typeof ref !== 'function') {
        ref.current?.focus();
      }
    }, [isSubmitting, ref]);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTodo(event.target.value);
      setError(null);
    };

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();

      const trimmedTitle = newTodo.trim();

      if (trimmedTitle.length === 0) {
        setError(errors.empty);

        return;
      }

      setLoadingTodos([...loadingTodos, 0]);
      setIsSubmitting(true);

      onSubmit({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      })
        .then(reset)
        .catch(() => {
          setError(errors.add);
        })
        .finally(() => {
          setLoadingTodos(loadingTodos.filter(todoId => todoId !== 0));
          setIsSubmitting(false);
        });
    };

    const allCompleted = todos.every(todo => todo.completed);

    return (
      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: allCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={() => onToggleAll(!allCompleted)}
            disabled={isSubmitting || loadingTodos.length > 0}
          ></button>
        )}

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className={classNames('todoapp__new-todo', {
              'is-loading': isSubmitting,
            })}
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={handleTitleChange}
            ref={ref}
            disabled={isSubmitting}
            autoFocus
          />
        </form>
      </header>
    );
  },
);
Header.displayName = 'Header';
