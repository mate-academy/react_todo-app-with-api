import classNames from 'classnames';
import React, {
  useContext,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { LoaderContext } from './Context/LoaderContext';
import { EditingTodo } from './EditingTodo';

interface Props {
  todo: Todo,
  onRemove: (todoId: number) => Promise<void>,
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>,
}

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onRemove,
  onUpdate,
}) => {
  const { title, id, completed } = todo;
  const { todosOnLoad } = useContext(LoaderContext);
  const [isEditing, setIsEditing] = useState(false);

  const isTodoOnProcessing = id === 0
    || todosOnLoad.includes(id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => onUpdate(
            todo.id,
            { completed: !completed },
          )}
        />
      </label>

      {!isEditing
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onRemove(id)}
            >
              ×
            </button>
          </>
        )
        : (
          <EditingTodo
            todo={todo}
            onUpdateTodo={onUpdate}
            onRemoveTodo={onRemove}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isTodoOnProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
