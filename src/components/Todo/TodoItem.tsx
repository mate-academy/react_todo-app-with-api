import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';
import { TodoTitleField } from '../TodoTitleField';

type Props = {
  todo: Todo,
  isAdding?: boolean,
  isDeleting?: boolean,
  onDelete?: (todoId: number) => void,
  onUpdate?: (chosenTodo: Todo) => void,
  isUpdating?: boolean | Todo,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  isDeleting,
  onDelete,
  onUpdate,
  isUpdating,
}) => {
  const { title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => {
            if (onUpdate !== undefined) {
              onUpdate(todo);
            }
          }}
        />
      </label>

      {isEditing
        ? <TodoTitleField />
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                if (onDelete !== undefined) {
                  onDelete(todo.id);
                }
              }}
            >
              ×
            </button>
          </>
        )}

      <TodoLoader
        isActive={isAdding}
        isDeleting={isDeleting}
        isUpdating={isUpdating}
      />
    </div>
  );
};
