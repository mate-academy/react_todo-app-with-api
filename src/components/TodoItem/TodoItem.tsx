/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  removeTodo: (todoId: number) => Promise<void>,
  updateTodo: (todoId: number) => Promise<void>,
  updateTodoTitle: (todoId: number) => Promise<void>,
  changeTodoTitle: (newTitle: string) => void,
  newTodoTitle: string,
  loadingIds: number[],
}

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  updateTodo,
  updateTodoTitle,
  changeTodoTitle,
  newTodoTitle,
  loadingIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const selectedField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedField.current) {
      selectedField.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    setIsTodoLoading(true);
    updateTodo(todo.id).finally(() => setIsTodoLoading(false));
  };

  const enterEditMode = () => {
    changeTodoTitle(todo.title);
    setIsEditing(true);
  };

  const clearEditFields = () => {
    changeTodoTitle('');
    setIsEditing(false);
  };

  const handleDelete = () => {
    setIsTodoLoading(true);
    removeTodo(todo.id).finally(() => setIsTodoLoading(false));
  };

  const handleTitleChange = () => {
    if (newTodoTitle === todo.title) {
      clearEditFields();

      return;
    }

    if (!newTodoTitle.trim()) {
      clearEditFields();
      handleDelete();
    }

    if (newTodoTitle.trim()) {
      setIsTodoLoading(true);
      updateTodoTitle(todo.id).finally(() => setIsTodoLoading(false));
      clearEditFields();
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleTitleChange();
  };

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeTodoTitle(event.target.value);
  };

  const onLostFocus = () => {
    handleTitleChange();
  };

  const handleKeySubmit = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleTitleChange();
    }
  };

  const handleKeyCancel = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      clearEditFields();
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={enterEditMode}

    >
      <label className="todo__status-label">
        <input
          disabled={isTodoLoading}
          checked={todo.completed}
          type="checkbox"
          className="todo__status"
          onChange={handleToggle}
        />
      </label>
      {!isEditing && (
        <>
          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            disabled={isTodoLoading}
            className="todo__remove"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}
      {(isEditing) && (
        <form
          onSubmit={onSubmit}
        >
          <input
            type="text"
            disabled={isTodoLoading}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={selectedField}
            value={newTodoTitle}
            onChange={changeTitle}
            onBlur={onLostFocus}
            onKeyDown={handleKeySubmit}
            onKeyUp={handleKeyCancel}
          />
        </form>
      )}
      <div
        className={classNames('modal overlay', {
          'is-active': isTodoLoading || loadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};
