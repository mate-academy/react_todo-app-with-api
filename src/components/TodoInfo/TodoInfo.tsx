import classNames from 'classnames';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import {
  deleteTodo,
  getActiveTodos,
  getTodos,
  updateTodo,
} from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';
import { ErrorStatus } from '../../types/errorStatus';

interface Props {
  todo: Todo,
  setErrorWithTimer: (message: string) => void;
  isLoading: string,
  setIsLoading: Dispatch<SetStateAction<string>>,
  setAllTodos: Dispatch<SetStateAction<Todo [] | null>>,
}

export const TodoInfo: React.FC<Props> = (props) => {
  const {
    todo,
    setErrorWithTimer,
    isLoading,
    setIsLoading,
    setAllTodos,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const user = useContext(AuthContext);

  const handleSuccessfulEdit = useCallback((() => {
    setIsLoading(String(todo.id));
    if (!newTitle && user) {
      deleteTodo(todo.id)
        .then(() => getActiveTodos(user.id))
        .then(userTodos => {
          setAllTodos(userTodos);
          setIsLoading('');
        })

        .catch(() => {
          setErrorWithTimer(ErrorStatus.DeleteError);
          setIsLoading('');
        });
    } else if (newTitle !== todo.title && user) {
      setIsLoading(String(todo.id));
      updateTodo(todo.id, { title: newTitle })
        .then(() => getTodos(user.id))
        .then(todos => setAllTodos(todos))
        .then(() => setIsLoading(''))

        .catch(() => {
          setErrorWithTimer(ErrorStatus.UpdateError);
          setIsLoading('');
        });
    }

    setIsEditing(false);
  }), [newTitle, todo, user]);

  const handlePressEsc = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewTitle(todo.title);
      }
    }, [todo],
  );

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      if (event.detail === 2) {
        setIsEditing(true);
      }
    }, [],
  );

  const handleCheckboxOnChange = useCallback(() => {
    setIsLoading(String(todo.id));
    if (user) {
      updateTodo(todo.id, { completed: !todo.completed })
        .then(() => getTodos(user.id))
        .then(todos => setAllTodos(todos))
        .then(() => setIsLoading(''))

        .catch(() => {
          setErrorWithTimer(ErrorStatus.UpdateError);
          setIsLoading('');
        });
    }
  }, [todo, user]);

  const handleDeleteTodo = useCallback(() => {
    setIsLoading(String(todo.id));
    if (user) {
      deleteTodo(todo.id)
        .then(() => getTodos(user.id))
        .then(userTodos => {
          setAllTodos(userTodos);
          setIsLoading('');
        })

        .catch(() => {
          setErrorWithTimer(ErrorStatus.DeleteError);
          setIsLoading('');
        });
    }
  }, [todo, user]);

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames(
          { todo: true },
          { completed: todo.completed },
        )}
      >
        {(todo.id === +isLoading) && (
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}

        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onChange={handleCheckboxOnChange}
          />
        </label>

        {isEditing
          ? (
            <form
              onSubmit={event => {
                event.preventDefault();
                handleSuccessfulEdit();
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onChange={event => setNewTitle(event.target.value)}
                onBlur={() => handleSuccessfulEdit()}
                onKeyDown={handlePressEsc}
              />
            </form>
          )
          : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onClick={handleDoubleClick}
                aria-hidden="true"
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={handleDeleteTodo}
              >
                ×
              </button>
            </>
          )}

      </div>
    </>
  );
};
