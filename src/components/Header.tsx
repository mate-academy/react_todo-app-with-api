import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { Error } from '../types/EnumError';

type Props = {
  todos: Todo[];
  showError: (error: string) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  tempTodo: Todo | null;
  onChange: (todo: Todo) => void;
  activeTodosIds: number[];
  fieldFocus: React.MutableRefObject<HTMLInputElement | null>;
  onAdd: (
    newTitle: string,
    setNewTitle: (newTitle: string) => void,
  ) => Promise<void>;
};

export const Header: React.FC<Props> = ({
  todos,
  showError,
  setTempTodo,
  tempTodo,
  onChange,
  activeTodosIds,
  fieldFocus,
  onAdd,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const allAreCompleted = todos.every(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      showError(Error.emptyTitle);
      fieldFocus.current?.focus();

      return;
    }

    setTempTodo({
      title: newTitle.trim(),
      completed: false,
      userId: USER_ID,
      id: 0,
    });

    onAdd(newTitle, setNewTitle);
  };

  const handleToggle = (todo: Todo) => {
    if (activeTodosIds.length) {
      if (activeTodosIds.includes(todo.id)) {
        const updatedTodo = Object.assign({}, todo);

        updatedTodo.completed = !todo.completed;

        return onChange(updatedTodo);
      }
    } else {
      const updatedTodo = Object.assign({}, todo);

      updatedTodo.completed = !todo.completed;

      return onChange(updatedTodo);
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allAreCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            todos.forEach(todo => handleToggle(todo));
          }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={fieldFocus}
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
