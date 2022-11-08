import React, { useContext } from 'react';
import classNames from 'classnames';
import {
  TodoContext, TodoUpdateContext,
} from '../ContextProviders/TodoProvider';

export const Header: React.FC = React.memo(() => {
  const {
    todos,
    newTodo,
    newTodoField,
    isAdding,
  } = useContext(TodoContext);
  const {
    handleNewSubmit,
    handleNewInput,
    changeAllComplet,
  } = useContext(TodoUpdateContext);
  const title = newTodo?.title || '';
  const isActive = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <button
        aria-label="all-check"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActive },
        )}
        onClick={() => changeAllComplet(isActive)}
      />

      <form onSubmit={handleNewSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleNewInput}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
