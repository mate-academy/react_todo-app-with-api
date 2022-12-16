import classNames from 'classnames';
import React, {
  useContext,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { LoaderContext } from './Context/LoaderContext';
import { EditTodo } from './EditTodo';

interface Props {
  todo: Todo,
  onRemoveTodo: (todoId: number) => Promise<void>,
  onUpdateTodo: (todoId: number, data: Partial<Todo>) => Promise<void>,
}

export const TodoComponent: React.FC<Props> = React.memo(({
  todo,
  onRemoveTodo,
  onUpdateTodo,
}) => {
  const { title, id, completed } = todo;
  const { todosOnLoad } = useContext(LoaderContext);
  const [isEditing, setIsEditing] = useState(false);

  const isTodoOnProccessing = id === 0
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
          onClick={() => onUpdateTodo(
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
              onClick={() => onRemoveTodo(id)}
            >
              ×
            </button>
          </>
        )
        : (
          <EditTodo
            todo={todo}
            onUpdateTodo={onUpdateTodo}
            onRemoveTodo={onRemoveTodo}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isTodoOnProccessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
