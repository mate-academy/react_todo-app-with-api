/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import clsx from 'clsx';

interface Props {
  todo: Todo;
  deleteTodo: (target: number) => void;
  targetsId: number[];
  updateState: (todo: Todo) => void;
  updateTitle: (todo: Todo, newTitle: string) => Promise<void> | undefined;
  ref: React.RefObject<HTMLInputElement>;
  isInput: (s: boolean) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  targetsId: targetId,
  updateState,
  updateTitle,
  ref,
  isInput,
}) => {
  const [formSwitch, setFormSwitch] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    isInput(true);

    if (todo.title === newTitle) {
      setFormSwitch(false);

      return;
    }

    if (newTitle === '') {
      deleteTodo(todo.id);

      return;
    }

    if (newTitle !== undefined) {
      updateTitle(todo, newTitle)
        ?.then(() => {
          setFormSwitch(false);
          isInput(false);
        })
        .catch(() => {
          return;
        });
    }
  }

  const escape = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setFormSwitch(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={clsx('todo', todo.completed && 'completed')}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => updateState(todo)}
        />
      </label>

      {formSwitch === false ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setFormSwitch(true)}
        >
          {todo.title}
        </span>
      ) : (
        <form onSubmit={e => handleSubmit(e)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            autoFocus
            onBlur={handleSubmit}
            onKeyUp={e => escape(e)}
            ref={ref}
          />
        </form>
      )}

      {/* Remove button appears only on hover */}
      {!formSwitch && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={clsx(
          'modal',
          'overlay',
          targetId.includes(todo.id) && 'is-active',
        )}
      >
        <div id="plug" className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
