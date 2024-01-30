import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

import { updateTodo, deleteTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  isProcessed: boolean;
  onDelete: () => void;
  onUpdate: (dataToUpdate: string | boolean) =>
  void | Promise<void | Partial<Todo>>,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete,
  onUpdate,
}) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleToggleChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    idToUpdate: number | undefined,
  ) => {
    const { target } = event;
    const { checked } = target;

    if (idToUpdate) {
      updateTodo(idToUpdate, { completed: checked });
      onUpdate(checked);
    }
  };

  const handleUpdateOnBlur = (
    event: React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    const { target } = event;
    const { value } = target as HTMLInputElement;

    const filteredText = value.replace(/(\r||\r)/g, '');

    setNewTitle(filteredText);

    if (filteredText !== '') {
      onUpdate(filteredText);
      setEditing(false);
    } else {
      setEditing(false);
      onDelete();
      deleteTodo(todo.id);
    }
  };

  const handleUpdateTitle = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const { key } = event;
    const { target } = event;
    const { value } = target as HTMLInputElement;

    const filteredText = value.replace(/(\r||\r||\s)/g, '');

    setNewTitle(filteredText);

    if (key === 'Enter') {
      if (filteredText !== '') {
        onUpdate(filteredText);
        setEditing(false);
      } else {
        setEditing(false);
        onDelete();
        deleteTodo(todo.id);
      }
    }
  };

  const handleDoubleClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const { target } = event;
    const { innerText } = target as HTMLSpanElement;

    setNewTitle(innerText);
    setEditing(true);
  };

  return (
    <div className={
      classNames(
        'todo',
        { completed: todo?.completed },
      )
    }
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={(event) => handleToggleChecked(event, todo.id)}
        />
      </label>

      {!editing
        ? (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo?.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )
        : (
          <form key="todo-form">
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              onKeyDown={handleUpdateTitle}
              onBlur={handleUpdateOnBlur}
              value={newTitle}
              onChange={(event) => setNewTitle(event?.target.value)}
            />
          </form>
        ) }
      {isProcessed && (
        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
