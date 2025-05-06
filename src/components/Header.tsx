import React, { useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  updateAll: () => void;
  handleAdd: (e: React.FormEvent<HTMLFormElement>) => void;
  editTodo: string;
  setEditTodo: (a: string) => void;
  disabledInput: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  allTodos: Todo[];
  temp: Todo | null;
}

export const Header: React.FC<Props> = ({
  updateAll,
  handleAdd,
  editTodo,
  setEditTodo,
  disabledInput,
  inputRef,
  allTodos,
  temp,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <header className="todoapp__header">
      {(allTodos.length > 0 || temp) && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={updateAll}
        ></button>
      )}
      <form onSubmit={handleAdd}>
        <input
          ref={inputRef}
          value={editTodo}
          disabled={disabledInput}
          onChange={e => setEditTodo(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
