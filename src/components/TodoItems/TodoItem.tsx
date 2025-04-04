/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodosContext } from '../../hook/useTodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem = ({ todo }: Props) => {
  const [newTitle, setNewTitle] = useState<string>(todo.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const {
    handleRenameTitle,
    toggleCompleted,
    removeTodo,
    processingTodoIds,
    handleTitleKeyEvents,
  } = useTodosContext();

  const { title, completed, id } = todo;

  const isProcessing = processingTodoIds?.includes(todo.id);

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label" htmlFor={`status-${id}`}>
        <input
          id={`status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleCompleted(todo)}
        />
      </label>
      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onKeyDown={event =>
              handleTitleKeyEvents(event, id, newTitle, setIsEditing)
            }
            autoFocus
            onBlur={event => {
              handleRenameTitle({ event, id, newTitle, setIsEditing });
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {title}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => removeTodo(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': (todo && !id) || isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
