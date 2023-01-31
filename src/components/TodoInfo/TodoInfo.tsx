import cn from 'classnames';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  onUpdate: (todo: Todo, prop: string, value: any) => void
  onDelete: (todoId: number) => void
  changingTodoIds: number | number[]
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onUpdate,
  onDelete,
  changingTodoIds,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isEditing]);

  const titleEditHandler = () => {
    if (!newTitle.length) {
      onDelete(todo.id);
    } else if (newTitle !== todo.title) {
      onUpdate(todo, 'title', newTitle);
    }

    setIsEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          onClick={() => {
            onUpdate(
              todo,
              'completed',
              !todo.completed,
            );
          }}
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      {isEditing
        ? (
          <form
            action="submit"
            onSubmit={(event) => {
              event.preventDefault();
              titleEditHandler();
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              value={newTitle}
              onChange={(event) => {
                setNewTitle(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setIsEditing(false);
                  setNewTitle(todo.title);
                }
              }}
              ref={newTodoField}
              onBlur={titleEditHandler}
              className="todo__title-field"
              placeholder="If the title is empty todo will be deleted"
              disabled={!isEditing}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setIsEditing(true);
              }}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                onDelete(todo.id);
              }}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          {
            'is-active': (typeof changingTodoIds === 'number')
              ? todo.id === changingTodoIds
              : (changingTodoIds as number[]).includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
