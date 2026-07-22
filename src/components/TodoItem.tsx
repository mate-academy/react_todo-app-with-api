/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
import React, { KeyboardEvent} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  loading: boolean;
  processingTodoIds: number[];
  editingTodoId: number | null;
  editingTitle: string;
  editField: React.RefObject<HTMLInputElement | null>;
  setEditingTitle: (value: string) => void;
  handleToggleTodo: (todo: Todo) => void;
  handleDelete: (id: number) => void;
  handleStartEditing: (todo: Todo) => void;
  saveEditing: (todo: Todo) => void;
  handleEditKeyUp: (
    event: KeyboardEvent<HTMLInputElement>,
  ) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  processingTodoIds,
  editingTodoId,
  editingTitle,
  editField,
  setEditingTitle,
  handleToggleTodo,
  handleDelete,
  handleStartEditing,
  saveEditing,
  handleEditKeyUp,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleTodo(todo)}
        />
      </label>

      {editingTodoId === todo.id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            saveEditing(todo);
          }}
        >
          <input
            ref={editField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editingTitle}
            onChange={event =>
              setEditingTitle(event.target.value)
            }
            onBlur={() => saveEditing(todo)}
            onKeyUp={handleEditKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleStartEditing(todo)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            loading ||
            processingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
