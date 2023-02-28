import classNames from 'classnames';
import React, { FormEvent, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todoId:number) => void;
  updatingTodoIds:number[];
  updateTodo: (todo: Todo, key:keyof Todo, value: string | boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  updatingTodoIds,
  updateTodo,
}) => {
  const { title, completed, id } = todo;

  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleRemoveButton = () => deleteTodo(id);
  const handleChangeStatus = () => {
    updateTodo(todo, 'completed', !todo.completed);
  };

  const handleEditedTitle = (event:React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const resetTitleEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditing(false);
    }
  };

  const setNewTitle = () => {
    const newTitle = editedTitle.trim();

    setEditing(false);
    setEditedTitle(newTitle);

    switch (newTitle) {
      case '':
        deleteTodo(id);

        break;

      case title:
        break;

      default:
        updateTodo(todo, 'title', newTitle);
        break;
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setNewTitle();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setEditing(true);
    }
  };

  return (
    <div
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => handleChangeStatus()}
        />
      </label>

      {editing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={handleEditedTitle}
              onKeyUp={resetTitleEdit}
              onBlur={setNewTitle}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>

        )
        : (
          <>
            <span
              role="button"
              tabIndex={0}
              aria-label="Press Enter to edit the title"
              className="todo__title"
              onKeyUp={handleKeyUp}
              onDoubleClick={() => setEditing(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleRemoveButton}
            >
              ×
            </button>

          </>
        )}

      <div
        className={classNames('modal', 'overlay', {
          'is-active': updatingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
