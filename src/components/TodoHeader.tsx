import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import { Error } from '../types/ErrorMsg';
import classNames from 'classnames';

type Props = {
  isSubmiting: boolean;
  todos: Todo[];
  todoTitle: string;
  setTodoTitle: (todoTitle: string) => void;
  setErrorMsg: (error: Error) => void;
  onAddTodo: (title: string) => void;
  allTodosCompleted: boolean;
  toggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  isSubmiting,
  todoTitle,
  setTodoTitle,
  setErrorMsg,
  onAddTodo,
  allTodosCompleted,
  toggleAll,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isSubmiting) {
      inputRef.current?.focus();
    }
  }, [isSubmiting, todos]);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    if (todoTitle.trim().length === 0) {
      return setErrorMsg(Error.EmptyTitle);
    }

    onAddTodo(todoTitle.trim());
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
