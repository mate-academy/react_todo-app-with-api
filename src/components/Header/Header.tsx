import React, { memo, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  addTodo: (title: string) => Promise<void>,
  isNewTodoLoading: boolean,
  toggleAllTodos: () => void,
  isAllTodosCompleted: boolean,
  todos: Todo[];
}

export const Header: React.FC<Props> = memo(({
  newTodoField,
  addTodo,
  isNewTodoLoading,
  toggleAllTodos,
  isAllTodosCompleted,
  todos,
}) => {
  const [title, setTitle] = useState('');

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addTodo(title);

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAllTodosCompleted,
          'is-invisible': !todos.length,
        })}
        onClick={toggleAllTodos}
      />

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isNewTodoLoading}
        />
      </form>
    </header>
  );
});
