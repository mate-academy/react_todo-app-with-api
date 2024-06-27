import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  onDelete?: (id: number) => void;
  onUpdate: (todo: Todo) => Promise<void>;
  processedId?: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  onUpdate,
  processedId,
}) => {
  const [isEditingTodo, setIsEditingTodo] = useState<Todo | null>(null);

  const { id, completed, title } = todo;

  const processedTodos = processedId?.includes(id) || id === 0;

  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current && isEditingTodo) {
      todoField.current.focus();
    }
  }, [isEditingTodo]);

  const handleTitleUpdate = (newTodo: Todo) => {
    if (newTodo !== todo) {
      onUpdate(newTodo).then(() => setIsEditingTodo(null));
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.key === 'Enter' && isEditingTodo) {
      if (isEditingTodo.title.length > 0) {
        handleTitleUpdate(isEditingTodo);
      } else {
        onDelete(isEditingTodo.id);
      }
    }

    if (e.key === 'Escape') {
      setIsEditingTodo(null);
    }
  };

  const handleBlur = () => {
    if (isEditingTodo) {
      handleTitleUpdate(isEditingTodo);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onUpdate({ ...todo, completed: !todo.completed })}
        />
      </label>

      {isEditingTodo?.id === id ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={isEditingTodo.title}
            onChange={e => {
              setIsEditingTodo({ ...isEditingTodo, title: e.target.value });
            }}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
            ref={todoField}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditingTodo(todo)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processedTodos,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
