import {
  FC,
  useCallback,
  useState,
  useEffect,
  FormEvent,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDeleteTodo: () => void;
  onUpdate: (todoId: number, isActive: Todo) => void;
}

export const TodoItem: FC<TodoItemProps> = ({
  todo,
  onDeleteTodo,
  onUpdate,
}) => {
  const {
    completed,
    title,
    id,
  } = todo;

  const [isLoading, setIsLoading] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [updatedTodoTitle, setUpdatedTodoTitle] = useState(title);

  const handleChangeStatus = useCallback(() => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    setIsLoading(true);
    onUpdate(id, updatedTodo);
  }, [completed]);

  const handleDelete = useCallback(() => {
    setIsLoading(true);
    onDeleteTodo();
  }, []);

  const handleChangeTitle = useCallback(() => {
    const updatedTodo = {
      ...todo,
      title: updatedTodoTitle,
    };

    setIsLoading(true);
    onUpdate(id, updatedTodo);
  }, [updatedTodoTitle]);

  const handleTitleEdit = () => {
    setIsTitleEditing(false);

    if (todo.title === updatedTodoTitle) {
      return;
    }

    if (updatedTodoTitle) {
      handleChangeTitle();
    } else {
      handleDelete();
    }
  };

  const handleTodoTitleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleTitleEdit();
  };

  const hasShowLoader = isLoading;

  const openEditor = () => {
    setIsTitleEditing(true);
  };

  const blurForm = () => {
    setIsTitleEditing(false);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsTitleEditing(false);
      }
    };

    document.addEventListener('keyup', handleEscape);

    return () => {
      document.removeEventListener('keyup', handleEscape);
    };
  }, [todo]);

  useEffect(() => {
    setIsLoading(false);
  }, [completed, title]);

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeStatus}
        />
      </label>

      {isTitleEditing ? (
        <form
          onSubmit={handleTodoTitleSubmit}
        >
          <input
            type="text"
            className="todo__title-field"
            value={updatedTodoTitle}
            onChange={(event) => setUpdatedTodoTitle(event.target.value)}
            onBlur={blurForm}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={openEditor}
          >
            {title}
          </span>

          <button
            type="button"
            className={classNames('todo__remove', {
              'is-active': hasShowLoader,
            })}
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': hasShowLoader,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
