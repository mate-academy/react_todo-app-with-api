/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC } from 'react';
import { Todo } from '../../types/Todo';

import { useAppContext } from '../../hooks/useAppContext';
import { useTodoItemLogic } from '../../hooks/useTodoItemLogic';

export interface ITodoItem {
  todo: Todo;
}

export const TodoItem: FC<ITodoItem> = ({ todo }) => {
  const { todoDeleteId } = useAppContext();

  const { title, completed } = todo;

  const {
    onCompletedClick,
    showForm,
    onDoubleClick,
    handleFormSubmit,
    inputRefForm,
    newTitle,
    setNewTitle,
    handleBlur,
    handleKeyUp,
    onDeleteClick,
    isDeleting,
  } = useTodoItemLogic(todo);

  const deletingThisTodo = todoDeleteId?.includes(todo.id);

  return (
    <div data-cy="Todo" className={`todo ${completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={onCompletedClick}
        />
      </label>
      {!showForm ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={onDoubleClick}
        >
          {title}
        </span>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            ref={inputRefForm}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}
      {!showForm && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDeleteClick}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isDeleting || deletingThisTodo ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
