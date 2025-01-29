/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useRef, useState, KeyboardEvent } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  deleteTodo?: (todoId: number) => Promise<boolean>;
  updateTodo?: (todoToUpdate: Todo) => Promise<boolean>;
  loadingIds: number[];
  isLoading: boolean;
}

export const TodoItem: FC<Props> = ({
  todo,
  deleteTodo = () => {},
  updateTodo = () => {},
  loadingIds,
  isLoading,
}) => {
  const editFieldRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoEdit = async () => {
    const trimmedTitle = newTitle.trim();

    if (todo.title === trimmedTitle) {
      setIsEditing(false);

      return;
    }

    if (trimmedTitle === '') {
      const successDelete = await deleteTodo(todo.id);

      if (!successDelete) {
        editFieldRef.current?.focus();
      }

      return;
    }

    const successUpdate = await updateTodo({
      ...todo,
      title: trimmedTitle,
    } as Todo);

    if (successUpdate) {
      setIsEditing(false);
    } else {
      editFieldRef.current?.focus();
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTodoEdit();
    }

    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  const toggleTodoStatus = () => {
    updateTodo({ ...todo, completed: !todo.completed });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleTodoStatus}
        />
      </label>

      {isEditing ? (
        <form onSubmit={e => e.preventDefault()}>
          <input
            autoFocus
            ref={editFieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleTodoEdit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingIds.includes(todo.id) || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
