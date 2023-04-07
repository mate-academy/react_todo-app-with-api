import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface HeaderPropsType {
  todos: Todo[],
  searchQuery: string,
  setSearchQuery: (searchQuery: string) => void,
  addTodo: (title: string) => unknown,
  onEmpty: () => void,
  addDisabled: boolean,
  completeAllToggle: () => void,
}

export const Header: React.FC<HeaderPropsType> = ({
  todos,
  searchQuery,
  setSearchQuery,
  addTodo,
  onEmpty,
  addDisabled,
  completeAllToggle,
}) => {
  const isActicve = todos.filter(todo => !todo.completed).length;

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isActicve === 0 },
          )}
          aria-label="Add todo"
          onClick={() => completeAllToggle()}
        />
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          if (!searchQuery) {
            onEmpty();
          } else {
            addTodo(searchQuery);
          }
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo on-focus"
          placeholder="What needs to be done?"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          disabled={addDisabled}
        />
      </form>
    </header>
  );
};
