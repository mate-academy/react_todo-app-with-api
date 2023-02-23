import React, { useState } from 'react';

import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDelete: (todoId: number) => void,
  handleUpdateTitle: (updatedTodo: Todo, newTitle: string) => void,
  updatedTodoId: number | boolean,
  handleUpdateCompleted: (todo: Todo) => void,
};

export const TodoInfo: React.FC<Props> = React.memo(({
  todo,
  handleDelete,
  updatedTodoId,
  handleUpdateTitle,
  handleUpdateCompleted,
}) => {
  const { title, completed } = todo;
  const [removedTodoId, setRemovedTodoId] = useState(0);
  const [isEdited, setIsEdited] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

  const handleChangeTitle = () => {
    setIsEdited(false);
    if (!newTodoTitle.trim()) {
      handleDelete(todo.id);
    }

    if (newTodoTitle !== todo.title) {
      handleUpdateTitle(todo, newTodoTitle);
    }
  };

  const closeInputByEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEdited(false);
    }
  };

  return (
    <div className={classNames(
      'todo',
      { completed: todo.completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => handleUpdateCompleted(todo)}
        />
      </label>

      {isEdited
        ? (
          <form
            onSubmit={() => {
              handleChangeTitle();
            }}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
              onBlur={() => {
                handleChangeTitle();
              }}
              onKeyDown={closeInputByEscape}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEdited(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                handleDelete(todo.id);
                setRemovedTodoId(todo.id);
              }}
            >
              ×
            </button>
          </>
        )}
      <div className={classNames(
        'modal',
        'overlay',
        {
          'is-active':
            removedTodoId
            || updatedTodoId === todo.id
            || updatedTodoId === true,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
