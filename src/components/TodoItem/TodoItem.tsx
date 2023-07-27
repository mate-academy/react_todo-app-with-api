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

  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState(todo.title);

  const [isLoading, setIsLoading] = useState(isTempTodo || false);

  const isChangingStatus = typeof toggleToStatus === 'boolean'
    && todo.completed !== toggleToStatus;

  const handleOnToggle = () => {
    const newTodo: Todo = {
      ...todo,
      completed: !todo.completed,
    };

    setIsLoading(true);

    todoUpdate(newTodo)
      .catch(error => error)
      .finally(() => setIsLoading(false));
  };

  const reset = () => {
    setQuery(todo.title);
    setIsEditing(false);
  };

  const handleOnDelete = () => {
    if (!isLoading) {
      setIsLoading(true);
    }

    todoDelete(todo.id)
      .catch(error => error)
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query === todo.title) {
      setIsEditing(false);

      return;
    }

    const newTodo = {
      ...todo,
      title: query.trim(),
    };

    setIsEditing(false);
    setIsLoading(true);

    if (!query) {
      handleOnDelete();

      return;
    }

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
        completed: todo.completed,
      })}
    >

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
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
            || (areCompletedDeletingNow && todo.completed)
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
