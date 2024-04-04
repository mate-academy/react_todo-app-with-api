import React from 'react';
import { ErrorMessages } from '../types/ErrorMessages';
import { USER_ID } from '../api/todos';
import { useTodos } from '../utils/TodoContext';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

export const Header: React.FC = () => {
  const {
    isLoading,
    createTodo,
    title,
    setTitle,
    showError,
    todos,
    changeCompleteTodo,
  } = useTodos();

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      showError(ErrorMessages.EmptyTitle);

      return;
    }

    const newTodo = {
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    };

    createTodo(newTodo);
  };

  const selectAllUncompleted = todos.filter((todo: Todo) => !todo.completed);
  const selectAllCompleted = todos.filter((todo: Todo) => todo.completed);

  const toggleCompletedAll = () => {
    if (!!selectAllUncompleted.length) {
      selectAllUncompleted.forEach(todo => changeCompleteTodo(todo));
    } else {
      selectAllCompleted.forEach(todo => changeCompleteTodo(todo));
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleCompletedAll()}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
          ref={input => input && input.focus()}
        />
      </form>
    </header>
  );
};
