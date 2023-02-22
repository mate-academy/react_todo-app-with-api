import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isClearCompleted: boolean,
  deleteTodo: (id: number) => void,
  deletingTodoId: number,
  editTodoStatus: (todo: Todo) => void,
  isToggle: boolean,
  editTodoTitle: (todo: Todo, newTitle: string) => void,
  handleEditingId: (id: number) => void,
  editingId: number,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  isClearCompleted,
  deleteTodo,
  deletingTodoId,
  editTodoStatus,
  isToggle,
  editTodoTitle,
  handleEditingId,
  editingId,
}) => {
  const { title, completed, id } = todo;
  const [value, setValue] = useState(title);
  const [isHovered, setHovered] = useState(false);
  const isClearCompletedActive = completed && isClearCompleted;
  const isTodoLoad = id === deletingTodoId || isClearCompletedActive
    || isToggle;

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;

    setValue(newTitle);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimTodoTitle = value.trim();

    if (trimTodoTitle === todo.title) {
      setValue(todo.title);
      handleEditingId(0);

      return;
    }

    if (!trimTodoTitle) {
      deleteTodo(todo.id);

      return;
    }

    editTodoTitle(todo, value);
    setValue(todo.title);
    handleEditingId(0);
  };

  return (
    <div
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn('todo',
        { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            editTodoStatus(todo);
          }}
        />
      </label>

      {editingId !== id && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            handleEditingId(id);
          }}
        >
          {title}
        </span>
      )}

      {editingId === id && (
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <input
            type="text"
            value={value}
            placeholder="Empty todo will be deleted"
            className="todo__title-field"
            onChange={(event) => {
              handleInput(event);
            }}
            onBlur={handleSubmit}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      )}

      {(editingId !== id && isHovered) && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => {
            deleteTodo(id);
          }}
        >
          ×
        </button>
      )}

      <div
        className={cn('modal overlay', {
          'is-active': isTodoLoad,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
