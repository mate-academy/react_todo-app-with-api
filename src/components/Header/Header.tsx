import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  todoTitle: string;
  onSetTodoTitle: (title: string) => void;
  submitNewTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
  onToggleAllTodos: () => void;
  isAllTodosCompleted: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  todoTitle,
  onSetTodoTitle: onGetTodoTitle,
  submitNewTodo,
  isAdding,
  onToggleAllTodos,
  isAllTodosCompleted,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          aria-label="Toggle All"
          onClick={onToggleAllTodos}
        />
      )}

      <form onSubmit={submitNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => onGetTodoTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
