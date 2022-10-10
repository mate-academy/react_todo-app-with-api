import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todoItem: Todo;
  handleDelete: (id: number)=> void;
  selectedTodo: number[];
  handleChangeStatus: (id: number, data: Partial<Todo>) => void;
  changeAllStatus: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todoItem,
  handleDelete,
  selectedTodo,
  handleChangeStatus,
  changeAllStatus,
}) => {
  const [newTitle, setNewTitle] = useState(todoItem.title);
  const [doubleClick, setDoubleClick] = useState(false);

  const newTodoField = useRef<HTMLInputElement>(null);

  const isActiveTodos = selectedTodo.includes(todoItem.id) || todoItem.id === 0;

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [doubleClick]);

  const handleTitleChange = () => {
    setDoubleClick(false);

    if (newTitle === todoItem.title) {
      return;
    }

    if (!newTitle.trim().length) {
      handleDelete(todoItem.id);
    } else {
      handleChangeStatus(todoItem.id, { title: newTitle });
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo', {
          'todo completed': todoItem.completed,
        },
      )}

    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={() => {
            handleChangeStatus(todoItem.id, { completed: !todoItem.completed });
          }}
        />
      </label>
      {
        (doubleClick)
          ? (
            <form
              onSubmit={handleTitleChange}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                ref={newTodoField}
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                onBlur={handleTitleChange}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setDoubleClick(false);
                  }
                }}
              />
            </form>
          )
          : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => setDoubleClick(true)}
              >
                {todoItem.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => handleDelete(todoItem.id)}
              >
                ×
              </button>
            </>
          )
      }

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isActiveTodos || changeAllStatus,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
