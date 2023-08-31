import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { TodoType } from '../../types/TodoType';

type Props = {
  todo: TodoType;
  isRemoveAll: boolean;
  isToggleAll: boolean;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, completed?: boolean, title?: string) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  isRemoveAll,
  isToggleAll,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;
  const [isEditing, setEdit] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleClick = () => {
    onDelete(id);
    setLoading(true);
  };

  const handleDblClick = () => {
    setEdit(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    onUpdate(id, e.target.checked);
  };

  const saveNewTitle = () => {
    setEdit(false);
    setLoading(true);

    switch (newTitle.trim()) {
      case '':
        onDelete(id);
        break;
      case title:
        setLoading(false);
        break;
      default:
        onUpdate(id, completed, newTitle);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveNewTitle();
  };

  useEffect(() => {
    setLoading(false);
  }, [completed, title]);

  return (
    <>
      <div
        className={classNames(
          'todo',
          { completed },
        )}
        onDoubleClick={handleDblClick}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={handleChange}
          />
        </label>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={saveNewTitle}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        ) : (
          <>
            <span className="todo__title">{title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleClick}
            >
              ×
            </button>
          </>
        )}
        <div
          className={classNames(
            'modal',
            'overlay',
            {
              'is-active':
                  isLoading
                  || (isRemoveAll && completed)
                  || (isToggleAll),
            },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
