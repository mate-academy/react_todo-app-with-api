import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  handleCreateTodo: CallableFunction,
  handleUpdateAllTodosStatus: () => void,
};

export const TodoAppHeader: React.FC<Props> = (props) => {
  const {
    handleCreateTodo,
    handleUpdateAllTodosStatus,
    todos,
  } = props;

  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleFormSubmit = (event: FormEvent) => {
    handleCreateTodo(event, newTodoTitle);
    setNewTodoTitle('');
  };

  const isAllTodosActive = () => todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: isAllTodosActive(),
          },
        )}
        onClick={handleUpdateAllTodosStatus}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
