/* eslint-disable no-console */
import React, { FormEvent, useEffect, useMemo, useRef } from 'react';
import { Todo } from '../../../types/Todo';
import classNames from 'classnames';
import { TodoCreateHandler, TodoToggleAll } from '../../../types/TodoMethods';

type Props = {
  todos: Todo[];
  onAddTodo: TodoCreateHandler;
  isLoading: boolean;
  onToggleAll: TodoToggleAll;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  isLoading,
  onAddTodo,
  onToggleAll,
}) => {
  const allActive = useMemo(
    () => todos?.every(todo => todo.completed) || false,
    [todos],
  );
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, [todos, isLoading]);

  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTitle = titleInputRef.current?.value?.trim() || '';

    try {
      await onAddTodo(newTitle);

      if (titleInputRef.current) {
        titleInputRef.current.value = '';
      }
    } catch {}
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allActive,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleInputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
