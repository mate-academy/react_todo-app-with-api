import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (val: number) => void,
  onUpdate: (val: Todo) => Promise<Todo>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
}) => {
  const {
    todos,
    isLoading,
    deletedId,
    errorMessage,
    isSubmitting,
  } = useContext(TodosContext);

  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState(todo.title);

  const onToggleChecked = (updatedTodo: Todo) => {
    return todos.map((t) => {
      if (t.id === updatedTodo.id) {
        const newUpdatedTodo = {
          ...t,
          completed: !t.completed,
        };

        onUpdate(newUpdatedTodo);
      }

      return todo;
    });
  };

  const isActive = (isLoading && deletedId.includes(todo.id))
    || (isSubmitting && todo.id === 0);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && errorMessage === 'Unable to update a todo') {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isEditing, errorMessage]);

  const handleUserKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setQuery(todo.title);
    }
  };

  const checkedForSuccess = () => {
    if (query.trim() === todo.title) {
      setIsEditing(false);

      return;
    }

    if (query.trim()) {
      onUpdate({ ...todo, title: query.trim() })
        .then(() => setIsEditing(false));
    } else {
      onDelete(todo.id);
    }
  };

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      checkedForSuccess();
    }, [query],
  );

  const handleBlur = useCallback(
    () => {
      setIsEditing(false);
      checkedForSuccess();
    }, [isEditing],
  );

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggleChecked(todo)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            onDoubleClick={handleDoubleClick}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>

        </>
      )
        : (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              disabled={isSubmitting}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={query}
              ref={inputRef}
              onBlur={handleBlur}
              onKeyUp={handleUserKeyPress}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', {
            'is-active': isActive,
          })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
