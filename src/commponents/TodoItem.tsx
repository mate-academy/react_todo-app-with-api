/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  deleteTodo?: (postId: number) => void;
  handleCheckedId?: (id: number) => void;
  todo: Todo;
  selectedId: number | null;
  updateTodo: (updatedTod: string, id: number) => void;
  handleUpdateTodo: (
    todoId: number,
    oldTitle: string,
    editingTitle: string,
  ) => Promise<boolean>;
  delitingTodos: number[];
};

export const TodoItem = ({
  todo,
  deleteTodo,
  delitingTodos,
  handleCheckedId,
  selectedId,
  handleUpdateTodo,
}: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTitle, setEditingTitle] = useState<string | ''>('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const isFinishedRef = useRef<boolean>(false);

  // #region functions
  function inputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditingTitle(e.target.value);
  }

  async function isFinishing() {
    if (isFinishedRef.current) {
      return;
    }

    isFinishedRef.current = true;

    const succes = await handleUpdateTodo(todo.id, todo.title, editingTitle);

    if (succes) {
      setIsEditing(false);
    } else {
      isFinishedRef.current = false;
    }
  }

  function isCancelation() {
    isFinishedRef.current = true;
    setEditingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEscape(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      isCancelation();
    }

    if (e.key === 'Enter') {
      isFinishing();
    }
  }
  // #endregion

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCheckedId?.(todo.id)}
          disabled={todo.id === selectedId}
        />
      </label>

      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingTitle(todo.title);
            setIsEditing(true);
            isFinishedRef.current = false;
          }}
        >
          {todo.title}
        </span>
      ) : (
        <input
          type="text"
          data-cy="TodoTitleField"
          value={editingTitle}
          className="todoapp__new-todo todoapp__new-todo--editing"
          ref={inputRef}
          onChange={inputChange}
          onBlur={isFinishing}
          onKeyDown={handleEscape}
        />
      )}
      {/* Remove button appears only on hover */}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            deleteTodo?.(todo.id);
          }}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            todo.id === 0 ||
            selectedId === todo.id ||
            delitingTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />

        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
