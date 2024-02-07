import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  filtredTodo: Todo[];
  newTodo: string;
  toggleAll: () => void;
  handleNewTodoSubmit: (event: React.FormEvent) => void;
  handleNewTodoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Header: React.FC<Props> = (
  {
    filtredTodo, 
    newTodo,
    toggleAll,
    handleNewTodoSubmit,
    handleNewTodoChange,
  }
) => {
  return (
    <header className="todoapp__header">
        <button
          type="button"
          onClick={toggleAll}
          className={cn('todoapp__toggle-all', {
            active: filtredTodo.filter(todo => todo.completed).length > 0
          })}
          data-cy="ToggleAllButton"
        />


      <form onSubmit={handleNewTodoSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleNewTodoChange}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </form>
    </header>
  )
}