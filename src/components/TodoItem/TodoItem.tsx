import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  updateTodo: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  updateTodo,
}) => {
  const {
    title, completed, id, loading,
  } = todo;
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleCompleted = () => {
    if (updateTodo) {
      updateTodo({
        ...todo,
        completed: !completed,
      });
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (!newTitle) {
      onDelete(id);
    } else if (newTitle === title) {
      setIsEditing(false);
    } else {
      updateTodo({
        ...todo,
        title: newTitle,
      });
    }

    setIsEditing(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    } else if (e.key === 'Enter') {
      if (!newTitle) {
        onDelete(id);
      } else if (newTitle === title) {
        setIsEditing(false);
      } else {
        updateTodo({
          ...todo,
          title: newTitle,
        });
      }

      setIsEditing(false);
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed })}
        onDoubleClick={handleDoubleClick}
      >

        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={handleCompleted}
          />
        </label>

        {isEditing ? (
          <input
            type="text"
            className="todo__title-field"
            value={newTitle}
            placeholder="Empty todo will be deleted"
            checked={completed}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            ref={inputRef}
          />
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {newTitle}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={onDelete ? () => onDelete(id) : undefined}
            >
              ×
            </button>
          </>
        )}

        {loading && (
          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay', {
                'is-active': loading,
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </>
  );
});

// {/* This is a completed todo */}
// <div data-cy="Todo" className="todo completed">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//       checked
//     />
//   </label>

//   <span data-cy="TodoTitle" className="todo__title">
//     Completed Todo
//   </span>

//   {/* Remove button appears only on hover */}
//   <button type="button" className="todo__remove" data-cy="TodoDelete">
//     ×
//   </button>

//   {/* overlay will cover the todo while it is being updated */}
//   <div data-cy="TodoLoader" className="modal overlay">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>

// {/* This todo is not completed */}
// <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

//   <span data-cy="TodoTitle" className="todo__title">
//     Not Completed Todo
//   </span>
//   <button type="button" className="todo__remove" data-cy="TodoDelete">
//     ×
//   </button>

//   <div data-cy="TodoLoader" className="modal overlay">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>

// {/* This todo is being edited */}
// <div data-cy="Todo" className="todo">
//   <label className="todo__status-label">
//     <input
//       data-cy="TodoStatus"
//       type="checkbox"
//       className="todo__status"
//     />
//   </label>

//   {/* This form is shown instead of the title and remove button */}
//   <form>
//     <input
//       data-cy="TodoTitleField"
//       type="text"
//       className="todo__title-field"
//       placeholder="Empty todo will be deleted"
//       value="Todo is being edited now"
//     />
//   </form>

//   <div data-cy="TodoLoader" className="modal overlay">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>

// </div>
