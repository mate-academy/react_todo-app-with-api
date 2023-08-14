import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { UpdateTodoArgs } from '../../types/UpdateTodoArgs';

interface Props {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  toggleTodoStatus:(
    todoId: number,
    args: UpdateTodoArgs
  ) => void;
  updatingTodosId: number[]
  updateTodoTitle: (todoId: number, args: UpdateTodoArgs) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  toggleTodoStatus,
  updatingTodosId,
  updateTodoTitle,

}) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);

  const inputField = useRef<HTMLInputElement>(null);
  const isUpdatingItem = updatingTodosId.includes(todo.id);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [isDoubleClicked]);

  const clearSelectedTodoId = () => {
    setIsDoubleClicked(false);
  };

  const resetTitle = () => setEditedTitle(todo.title);

  const handleToggleTodoStatus = () => toggleTodoStatus(
    todo.id,
    { completed: !todo.completed },
  );

  const handleDoubleClick = (
    event: React.MouseEvent<HTMLSpanElement>,
  ) => {
    event.preventDefault();
    setIsDoubleClicked(true);
  };

  const handleInputChanges = (event:React.ChangeEvent<HTMLInputElement>) => (
    setEditedTitle(event.target.value)
  );

  const changeTittleIfEdited = () => {
    if (editedTitle !== todo.title) {
      updateTodoTitle(todo.id, { title: editedTitle });
    }
  };

  const handleOnBlur = () => {
    changeTittleIfEdited();

    clearSelectedTodoId();
  };

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    changeTittleIfEdited();

    clearSelectedTodoId();
  };

  const handleCancelEditing = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Escape') {
      return;
    }

    clearSelectedTodoId();
    resetTitle();
  };

  const handleTodoRemove = () => {
    deleteTodo(todo.id);
  };

  return (
    <div
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
    >

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodoStatus}
        />
      </label>

      { isDoubleClicked
        ? (
          <form
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={handleInputChanges}
              onBlur={handleOnBlur}
              onKeyDown={handleCancelEditing}
              ref={inputField}

            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}

            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleTodoRemove}
            >
              ×

            </button>
          </>
        )}

      <div
        className={cn(
          'modal overlay',
          { ' is-active': isUpdatingItem },
        )}
      >
        <div className="modal-background has-background-white-ter " />
        <div className="loader " />
      </div>

    </div>
  );
};
