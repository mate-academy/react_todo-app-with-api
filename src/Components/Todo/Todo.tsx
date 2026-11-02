/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  completed: boolean;
  title: string;
  isActive?: boolean;
  todoId: number;
  handleTodoDeletion?: (status: boolean, id?: number) => void;
  activeTodos: number[];
  handleStatusChange: (
    todoId: number,
    currentStatus: boolean,
  ) => Promise<boolean>;
  onSuccessTitleUpdate: (todoId: number, newTitle: string) => void;
  onFailedTitleUpdate: () => void;
};

export const Todo: React.FC<Props> = ({
  completed,
  title,
  isActive = false,
  todoId,
  handleTodoDeletion,
  activeTodos,
  handleStatusChange,
  onSuccessTitleUpdate,
  onFailedTitleUpdate,
}) => {
  const [active, setActive] = useState(isActive);
  const [activeSingle, setActiveSingle] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (activeTodos.includes(todoId)) {
      return setActive(true);
    }

    if (activeSingle && active === false) {
      setActive(true);
    }

    if (activeSingle) {
      return;
    }

    if (isActive) {
      setActive(true);

      return;
    }

    if (activeTodos.length === 0 && active) {
      setActive(false);
    }
  }, [activeTodos, todoId, active, activeSingle, isActive]);

  const onTodoDeletion = () => {
    setActive(true);
    setActiveSingle(true);

    deleteTodo(todoId)
      .then(() => {
        handleTodoDeletion?.(true, todoId);
      })
      .catch(() => {
        setActive(false);
        setActiveSingle(false);
        handleTodoDeletion?.(false);
      });
  };

  const onTodoStatusChange = async () => {
    setActiveSingle(true);
    await handleStatusChange(todoId, completed);
    setActiveSingle(false);
  };

  const handleInputDoubleClick = () => {
    setNewTitle(title);
    setEditFormOpen(true);
  };

  const handleTitleEdit = async () => {
    if (!editFormOpen) {
      return;
    }

    if (newTitle === title) {
      setEditFormOpen(false);

      return;
    }

    if (newTitle.trim() === '') {
      onTodoDeletion();

      return;
    }

    setActiveSingle(true);

    await updateTodo(todoId, { title: newTitle })
      .then(() => {
        onSuccessTitleUpdate(todoId, newTitle.trim());
        setEditFormOpen(false);
      })
      .catch(() => onFailedTitleUpdate());

    setActiveSingle(false);
  };

  const handleFormKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditFormOpen(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={onTodoStatusChange}
        />
      </label>

      {editFormOpen ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleTitleEdit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            autoFocus
            onKeyUp={handleFormKeyPress}
            onBlur={handleTitleEdit}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleInputDoubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onTodoDeletion}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': active })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
