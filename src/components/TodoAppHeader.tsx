import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  isLoading: boolean,
  tempTodo: Todo | null,
  addTodo: (event: React.FormEvent) => void,
  newTitle: string,
  setNewTitle: (newTitle: string) => void,
  updateStatusForAllTodos: () => void,
}

export const TodoAppHeader: React.FC<Props> = ({
  todos,
  isLoading,
  tempTodo,
  addTodo,
  newTitle,
  setNewTitle,
  updateStatusForAllTodos,
}) => {
  const hasActiveTodo = todos.some(todo => !todo.completed);
  const isActiveInput = tempTodo !== null;
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current && todos.length !== 0) {
      titleField.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !hasActiveTodo,
          })}
          onClick={() => updateStatusForAllTodos()}
          disabled={isLoading}
        />
      )}

      <form onSubmit={addTodo}>
        <input
          type="text"
          ref={titleField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          disabled={isActiveInput}
        />
      </form>
    </header>
  );
};
