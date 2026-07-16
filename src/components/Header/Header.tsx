import React, { useEffect, FormEvent } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface HeaderProps {
  todo: Todo;
  todos: Todo[];
  addNewTodo: string;
  isHeaderLoading: boolean;
  completedTodos: Todo[];
  headerInputRef: React.RefObject<HTMLInputElement>;
  setAddNewTodo: (value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handlePatchAllToggle: (todoId: number) => void;
  setLoading: (value: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  todo,
  todos,
  addNewTodo,
  completedTodos,
  headerInputRef,
  isHeaderLoading,
  setAddNewTodo,
  handleSubmit,
  handlePatchAllToggle,
  setLoading,
}) => {
  useEffect(() => {
    if (!isHeaderLoading && headerInputRef.current) {
      headerInputRef.current.focus();
    }
  }, [isHeaderLoading, headerInputRef]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos.length === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            handlePatchAllToggle(todo.id);
          }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={headerInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={addNewTodo}
          onChange={event => {
            setAddNewTodo(event.target.value);
            setLoading(false);
          }}
          disabled={isHeaderLoading}
          autoFocus
        />
      </form>
    </header>
  );
};
