import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { TodoContext } from '../TodoContext';
import { ErrorContext } from '../ErrorContext';
import { GlobalLoader } from '../../types/GlobalLoader';

type Props = {
  todo: Todo;
  loader: GlobalLoader;
};

export const TodoItem: React.FC<Props> = ({ todo, loader }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const { setError } = useContext(ErrorContext);
  const { setTodos } = useContext(TodoContext);
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const focusInput = useRef<HTMLInputElement | null>(null);

  const disableEditing = () => {
    setEditing('');
    setIsEditing(false);
  };

  const deleteTodoById = () => {
    setIsLoading(true);

    deleteTodo(id)
      .then(() => {
        return setTodos(prevState => prevState
          .filter(pTodo => pTodo.id !== id));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setIsLoading(false));
  };

  const updateTodoById = (data: Partial<Todo>) => {
    setIsLoading(true);
    updateTodo(id, data)
      .then((updatedTodo) => setTodos(prevState => {
        return prevState
          .map(prevTodo => (prevTodo.id !== id ? prevTodo : updatedTodo));
      }))
      .catch(() => setError('Unable to update a todo'))
      .finally(() => setIsLoading(false));
  };

  const saveChanges = () => {
    if (editing === title) {
      disableEditing();

      return;
    }

    if (!editing) {
      deleteTodoById();
      disableEditing();

      return;
    }

    updateTodoById({ title: editing });
    disableEditing();
  };

  const handleDeleteClick = () => {
    deleteTodoById();
  };

  const handleCheckBoxChange = () => {
    updateTodoById({ completed: !completed });
  };

  const handleTitleDoubleClick = () => {
    setEditing(title);
    setIsEditing(true);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveChanges();
  };

  const handleInputBlur = () => {
    saveChanges();
  };

  const handleEscUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      disableEditing();
    }
  };

  useEffect(() => {
    switch (loader) {
      case GlobalLoader.All:
        setIsLoading(true);
        break;
      case GlobalLoader.Active:
        if (!completed) {
          setIsLoading(true);
        }

        break;
      case GlobalLoader.Completed:
        if (completed) {
          setIsLoading(true);
        }

        break;
      default:
        setIsLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    if (isEditing && focusInput.current) {
      focusInput.current.focus();
    }
  }, [isEditing]);

  return (
    <>
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
            onChange={handleCheckBoxChange}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleFormSubmit}>
            <input
              ref={focusInput}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editing}
              onChange={(event) => setEditing(event.target.value)}
              onBlur={handleInputBlur}
              onKeyUp={handleEscUp}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleTitleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteClick}
            >
              ×
            </button>
          </>
        )}

        <div className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
