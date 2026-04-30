/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoList } from '../TodoList/TodoList';
export interface TaskItemProps {
  post: Todo;
  deletingTodoId: number | null;
  handleTodoStatus: (id: number, checked: boolean) => Promise<void>;
  onDelete: (postId: number) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setPosts: React.Dispatch<React.SetStateAction<Todo[]>>;
  isUpdating: boolean;
  setIsUpdating: (value: boolean) => void;
}
export const TaskItem: React.FC<TaskItemProps> = ({
  post,
  deletingTodoId,
  handleTodoStatus,
  onDelete,
  setErrorMessage,
  setPosts,
  isUpdating,
  setIsUpdating,
}) => {
  const isLoading = deletingTodoId === post.id || isUpdating;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      key={post.id}
      data-cy="Todo"
      className={classNames('todo', { completed: post.completed })}
    >
      <label className="todo__status-label" htmlFor={`todoStatus-${post.id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          id={`todoStatus-${post.id}`}
          className="todo__status"
          onChange={event => handleTodoStatus(post.id, event.target.checked)}
          checked={post.completed}
        />
      </label>
      {isEditing ? (
        <TodoList
          onDelete={onDelete}
          todo={post}
          setErrorMessage={setErrorMessage}
          setPosts={setPosts}
          setIsEditing={setIsEditing}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          onDoubleClick={() => setIsEditing(true)}
          className="todo__title"
        >
          {post.title}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          aria-label="Delete todo"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(post.id)}
          disabled={deletingTodoId === post.id && isEditing}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
