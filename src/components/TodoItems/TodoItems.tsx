import React, { useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface TodoItemsProps {
  todo: Todo;
  loadingTodo: boolean;
  editingId: number | null;
  activeInputRef: React.RefObject<HTMLInputElement>;
  handleDelete: (todoId: number) => void;
  handlePatch: (todoId: number, completed: boolean, title: string) => void;
  handlePatchText: (todoId: number, completed: boolean, title: string) => void;
  setEditingId: (id: number | null) => void;
}

export const TodoItems: React.FC<TodoItemsProps> = ({
  todo,
  loadingTodo,
  editingId,
  activeInputRef,
  handleDelete,
  handlePatch,
  handlePatchText,
  setEditingId,
}) => {
  const checkboxId = `todo-status-${todo.id}`;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId === todo.id && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId, todo.id, inputRef]);

  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label" htmlFor={checkboxId}>
        {/**/}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          id={checkboxId}
          onChange={() => {
            handlePatch(todo.id, !todo.completed, todo.title);
          }}
        />
      </label>

      {editingId === todo.id ? (
        <input
          autoFocus
          ref={activeInputRef}
          data-cy="TodoTitleField"
          className="todo__title-field"
          defaultValue={todo.title}
          onBlur={e => {
            handlePatchText(todo.id, todo.completed, e.target.value);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handlePatchText(todo.id, todo.completed, e.currentTarget.value);
            }

            if (e.key === 'Escape') {
              setEditingId(null);
            }
          }}
          placeholder="Empty todo will be deleted"
        />
      ) : (
        <span
          ref={inputRef}
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingId(todo.id);
          }}
        >
          {todo.title}
        </span>
      )}

      {editingId !== todo.id ? (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            handleDelete(todo.id);
          }}
        >
          &times;
        </button>
      ) : (
        ``
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': loadingTodo })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
