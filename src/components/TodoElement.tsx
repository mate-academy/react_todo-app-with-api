import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../Context/TodoContext';

type Props = {
  todo: Todo,
};

export const TodoElement: React.FC<Props> = ({ todo }) => {
  const { completed, title, id } = todo;
  const {
    handleTodoDelete,
    todosIdToDelete,
    handleTodoUpdate,
  } = useContext(TodoContext);

  const [isChecked, setIsChecked] = useState(completed);
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(title);
  const shouldDisplayLoader = id === 0 || todosIdToDelete.includes(id);

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle) {
      await handleTodoUpdate(todo, todoTitle);
    } else {
      await handleTodoDelete(id);
    }

    setIsEditing(false);
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: isChecked },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={(event) => {
            setIsChecked(event.target.checked);
          }}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleTodoChange}
            onBlur={handleTodoChange}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTodoTitleChange}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
              onBlur={() => {
                setIsEditing(false);
              }}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                handleTodoDelete(id);
              }}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': shouldDisplayLoader,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
