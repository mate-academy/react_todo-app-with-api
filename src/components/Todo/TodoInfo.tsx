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

  const handleOpenEditor = () => setEditing(true);
  // eslint-disable-next-line max-len
  const handleCloseEditor = (event: React.FocusEvent<HTMLInputElement, Element> | React.FormEvent<HTMLFormElement>) => {
    setEditing(false);

    if (event.target instanceof HTMLFormElement) {
      handleTitleChange(id, event.target.TodoTitleField.value.trim());
    } else if (event.target instanceof HTMLInputElement) {
      handleTitleChange(id, event.target.value.trim());
    }
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
              handleCloseEditor(event);
            }}
          >
            <input
              data-cy="TodoTitleField"
              name="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={title}
              onBlur={(event) => handleCloseEditor(event)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
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
