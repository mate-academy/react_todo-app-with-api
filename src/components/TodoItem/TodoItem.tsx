import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EditTodo, Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  updatingIds: number[];
  deletingIds: number[];
  selectedUpdateTodo: number | null;
  editTodo: EditTodo | null;
  loadingIds: number[];
  todo: Todo;
  loaderClearButton: boolean;
  tempTodo: Todo | null;
  onSelectedTodo: (todoId: number) => void;
  setToggleTodo: (todo: Todo) => void;
  setEditTodo: (todo: EditTodo) => void;
  setSelectedUpdateTodo: (id: number | null) => void;
};

export const TodoItem = React.memo<Props>(
  ({
    updatingIds,
    deletingIds,
    selectedUpdateTodo,
    setSelectedUpdateTodo,
    editTodo,
    loadingIds,
    todo,
    loaderClearButton,
    tempTodo,
    onSelectedTodo,
    setToggleTodo,
    setEditTodo,
  }) => {
    const titleField = useRef<HTMLInputElement>(null);
    const [editTitle, setEditTitle] = useState(todo.title);
    const showForm = selectedUpdateTodo === todo.id;

    const saveEdit = useCallback(() => {
      if (todo.title === editTitle.trim()) {
        setSelectedUpdateTodo(null);

        return;
      }

      if (!editTitle.trim()) {
        onSelectedTodo(todo.id);
      } else {
        setEditTodo({
          id: todo.id,
          title: editTitle.trim(),
        });
      }
    }, [editTitle, todo, onSelectedTodo, setEditTitle]);

    const handleSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        saveEdit();
      },
      [editTitle, todo, onSelectedTodo, setEditTitle],
    );

    const handleEsc = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
          setSelectedUpdateTodo(null);
        }
      },
      [setSelectedUpdateTodo],
    );

    useEffect(() => {
      if (titleField.current && selectedUpdateTodo !== null) {
        titleField.current.focus();
      }
    }, [selectedUpdateTodo]);

    return (
      <div
        data-cy="Todo"
        className={classNames('todo item-enter-item', {
          completed: todo.completed,
        })}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            readOnly
            onClick={() => setToggleTodo(todo)}
          />
        </label>
        {showForm && (
          <form onSubmit={handleSubmit}>
            <input
              ref={titleField}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              onChange={event => setEditTitle(event.target.value)}
              value={editTitle}
              onKeyDown={handleEsc}
              onBlur={saveEdit}
            />
          </form>
        )}

        {!showForm && (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setSelectedUpdateTodo(todo.id)}
            >
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onSelectedTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay ', {
            'is-active':
              todo.id === tempTodo?.id ||
              deletingIds.includes(todo.id) ||
              (loaderClearButton && todo.completed) ||
              updatingIds.includes(todo.id) ||
              loadingIds.includes(Number(todo.id)) ||
              editTodo?.id === todo.id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
