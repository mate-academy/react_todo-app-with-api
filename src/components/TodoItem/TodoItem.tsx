import classNames from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  isDeleteWaiting: boolean;
  changeTodosIdsToRemove: (id: number) => void;
  removeDeleteId: (id: number) => void;
  todosIdsToRemove: number[];
  changeCompletedStatus: (todoId: number, status: boolean) => void;
  todosIdsToUpdate: number[];
  changeTodosIdsToUpdate: (value: number) => void;
  removeUpdatedId: (value: number) => void;
  changeTodoTitle: (todoId: number, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = (
  {
    todo,
    deleteTodo,
    isDeleteWaiting,
    changeTodosIdsToRemove,
    removeDeleteId,
    todosIdsToRemove,
    changeCompletedStatus,
    todosIdsToUpdate,
    changeTodosIdsToUpdate,
    removeUpdatedId,
    changeTodoTitle,
  },
) => {
  const { title, completed, id } = todo;

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleDoubleClick = () => {
    setShowForm(true);
  };

  const handleDeleteButtonClick = async (todoId: number) => {
    changeTodosIdsToRemove(id);

    await deleteTodo(todoId);

    removeDeleteId(todoId);
  };

  const toggleTodoStatus = async (todoId: number, status: boolean) => {
    changeTodosIdsToUpdate(todoId);

    const newStatus = !status;

    await changeCompletedStatus(todoId, newStatus);

    removeUpdatedId(todoId);
  };

  const handleTitleEdit = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setNewTitle(value);
  };

  const saveNewTitle = async (event: FormEvent) => {
    event.preventDefault();

    const normalizedNewTitle = newTitle.trim();

    if (normalizedNewTitle === title) {
      setShowForm(false);

      return;
    }

    if (normalizedNewTitle.length === 0) {
      setShowForm(false);
      handleDeleteButtonClick(id);

      return;
    }

    changeTodosIdsToUpdate(id);
    setShowForm(false);
    await changeTodoTitle(id, newTitle);
    removeUpdatedId(id);
    setNewTitle(newTitle);
  };

  const hideForm = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    if (key === 'Escape') {
      setShowForm(false);
      setNewTitle(title);
    }
  };

  const isTodoChanging = (isDeleteWaiting && todosIdsToRemove.includes(id))
    || (isDeleteWaiting && todosIdsToUpdate.includes(id));

  return (
    <div
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => toggleTodoStatus(id, completed)}
        />
      </label>

      {showForm
        ? (
          <form onSubmit={saveNewTitle}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleTitleEdit}
              onBlur={saveNewTitle}
              onKeyUp={hideForm}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        )
        : (
          <>
            <span className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteButtonClick(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay',
        {
          'is-active': isTodoChanging,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
