/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, FormEvent } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteHandler: (todoId: number) => void,
  updateHandler: (id: number, data: Partial<Todo>) => void,
};

export const TodoListItem: React.FC<Props> = React.memo((
  { todo, deleteHandler, updateHandler },
) => {
  const { id, title, completed } = todo;
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);

  const handleTitleChange = () => {
    setIsDoubleClicked(false);

    if (title === updatedTitle) {
      return;
    }

    if (!updatedTitle) {
      deleteHandler(id);

      return;
    }

    updateHandler(id, { title: updatedTitle });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleTitleChange();
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            updateHandler(id, { completed: !completed });
          }}
        />
      </label>

      {isDoubleClicked
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="If your todo is empty, it will be deleted"
              value={updatedTitle}
              onChange={(event) => {
                const { value } = event.target;

                setUpdatedTitle(value.trimStart());
              }}
              onBlur={handleSubmit}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onClick={(event) => {
                if (event.detail === 2) {
                  setIsDoubleClicked(true);
                }
              }}
              onKeyDown={() => {}}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deleteHandler(id)}
            >
              x
            </button>

            <div
              data-cy="TodoLoader"
              className="modal overlay is-activel"
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        )}
    </div>
  );
});
