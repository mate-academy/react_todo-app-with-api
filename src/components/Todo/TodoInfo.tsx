import classNames from 'classnames';
import React, { useState } from 'react';

import { Todo } from '../../types/Todo';
import { TodoLoader } from './TodoLoader';

type Props = {
  todo: Todo;
  handleChangeStatus: (todoId: number, status: boolean) => void,
  handleDeleteTodo: (todoId: number) => void,
  isLoading: boolean,
  handleTitleChange: (todoId: number, title: string) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  handleChangeStatus,
  handleDeleteTodo,
  isLoading,
  handleTitleChange,
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleOpenEditor = () => setEditing(true);
  // eslint-disable-next-line max-len
  const handleCloseEditor = () => {
    setEditing(false);

    handleTitleChange(id, newTitle.trim());
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChangeStatus(id, completed)}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleCloseEditor();
            }}
          >
            <input
              data-cy="TodoTitleField"
              name="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={title}
              onBlur={() => handleCloseEditor()}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  handleCloseEditor();
                }
              }}
              onChange={(event) => setNewTitle(event.target.value)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleOpenEditor}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>
          </>
        ) }

      {isLoading && <TodoLoader />}
    </div>
  );
};
