import cn from 'classnames';
import {
  useState,
  useContext,
  FormEvent,
} from 'react';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types';

interface Props {
  todo: Todo,
  isTempTodo?: boolean,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isTempTodo,
}) => {
  const {
    todoDelete,
    areCompletedDeletingNow,
    todoUpdate,
    toggleToStatus,
  } = useContext(TodosContext);

  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState(title);

  const [isLoading, setIsLoading] = useState(isTempTodo || false);

  const isChangingStatus = typeof toggleToStatus === 'boolean'
    && todo.completed !== toggleToStatus;

  const handleOnToggle = () => {
    const newTodo: Todo = {
      ...todo,
      completed: !completed,
    };

    setIsLoading(true);

    todoUpdate(newTodo)
      .catch(error => error)
      .finally(() => setIsLoading(false));
  };

  const reset = () => {
    setQuery(title);
    setIsEditing(false);
  };

  const handleOnDelete = () => {
    if (!isLoading) {
      setIsLoading(true);
    }

    todoDelete(id)
      .catch(error => error)
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query === title) {
      setIsEditing(false);

      return;
    }

    const normalizedQuery = query.trim();

    setQuery(normalizedQuery);

    setIsEditing(false);
    setIsLoading(true);

    if (!normalizedQuery) {
      handleOnDelete();

      return;
    }

    const newTodo = {
      ...todo,
      title: normalizedQuery,
    };

    todoUpdate(newTodo)
      .catch(error => error)
      .finally(() => setIsLoading(false));
  };

  const handleOnKeyUp = (key: string) => {
    if (key === 'Escape') {
      reset();
    }
  };

  return (
    <div
      className={cn('todo', {
        completed,
      })}
    >

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={handleOnToggle}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              onBlur={reset}
              onKeyUp={(event) => handleOnKeyUp(event.key)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleOnDelete}
            >
              ×
            </button>
          </>
        )}

      <div
        className={cn('modal', 'overlay', {
          'is-active': isLoading
            || (areCompletedDeletingNow && completed)
            || isChangingStatus,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
