/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';
import { TodoForm } from './TodoForm';

interface Props {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  idsProcessing?: number | null;
  isLoading?: boolean;
  onEdit: (
    id: number,
    data: Partial<Todo>,
  ) => Promise<void | { error: boolean } | undefined>;
  loadingIds: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  idsProcessing,
  isLoading,
  onEdit,
  loadingIds,
}) => {
  const { id, completed, title } = todo;

  const [isEditing, setIsEditing] = useState(false);

  const inputChangeField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputChangeField.current && isEditing) {
      inputChangeField.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = (editedTitle: string) => {
    if (!editedTitle.trim()) {
      return handleDeleteTodo(id);
    }

    if (editedTitle === title) {
      setIsEditing(false);

      return;
    }

    onEdit(id, { title: editedTitle.trim() }).then(response =>
      setIsEditing(!!response?.error),
    );
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onEdit(id, { completed: !completed })}
        />
      </label>

      {isEditing ? (
        <div onKeyUp={({ key }) => key === 'Escape' && setIsEditing(false)}>
          <TodoForm
            title={title}
            onSubmit={handleSubmit}
            inputChangeField={inputChangeField}
          />
        </div>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            todo.id === idsProcessing || isLoading || loadingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
