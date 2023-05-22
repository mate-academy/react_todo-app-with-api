import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Rings } from 'react-loader-spinner';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  onDelete: (todoId: number) => Promise<void>,
  isLoading: boolean,
  onUpdateTodo: (id: number, todoData: Todo) => Promise<void>,
  error: React.Dispatch<React.SetStateAction<string>>,
}

export const SingleTodo: React.FC<Props> = React.memo(
  ({
    todo,
    onDelete,
    isLoading,
    onUpdateTodo,
    error,
  }) => {
    const { id, title, completed } = todo;
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isEditing && titleRef.current) {
        titleRef.current.focus();
      }
    }, [isEditing]);

    const submitChanges = async () => {
      if (newTitle.trim() === '') {
        await onDelete(id);
      } else if (newTitle !== title) {
        try {
          await onUpdateTodo(id, {
            ...todo,
            title: newTitle,
          });
        } catch {
          error('Unable to update todo!');
        }
      }

      setIsEditing(false);
    };

    const handleDoubleClick = () => {
      setIsEditing(true);
      setNewTitle(title);
    };

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event?.target;

      setNewTitle(value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        submitChanges();
      } else if (event.key === 'Escape') {
        setIsEditing(false);
      }
    };

    const changeCheck = () => {
      onUpdateTodo(id, {
        ...todo,
        completed: !completed,
      });
    };

    return (
      <div
        key={id}
        className={classNames(
          'todo',
          { completed },
        )}
      >
        {!isLoading
          ? (
            <>
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={completed}
                  onChange={changeCheck}
                />
              </label>

              {isEditing ? (
                <input
                  type="text"
                  className="todo__title-field"
                  value={newTitle}
                  onBlur={() => submitChanges()}
                  onKeyDown={handleKeyDown}
                  onChange={handleChangeTitle}
                  ref={titleRef}
                />
              ) : (
                <>
                  <span
                    className="todo__title"
                    onDoubleClick={handleDoubleClick}
                  >
                    {title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => onDelete(id)}
                  >
                    x
                  </button>
                </>
              )}

              {isEditing && (
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => onDelete(id)}
                >
                  x
                </button>
              )}

              <div className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </>
          )
          : (
            <Rings
              height="58"
              width="58"
              color="pink"
              radius="6"
              wrapperStyle={{}}
              wrapperClass=""
              visible
              ariaLabel="rings-loading"
            />
          )}
      </div>
    );
  },
);
