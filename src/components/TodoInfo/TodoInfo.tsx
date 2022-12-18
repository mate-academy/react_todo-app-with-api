import classNames from 'classnames';
import {
  useCallback,
  useContext,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import {
  deleteTodo,
  updateTodo,
} from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';
import { ErrorStatus } from '../../types/errorStatus';
import { Loader } from '../Loader/Loader';
import { setIsLoadingContext } from '../Context/context';

interface Props {
  todo: Todo,
  setErrorWithTimer: (message: string) => void;
  isLoading: number[],
  loadUserTodos: () => void,
}

export const TodoInfo: React.FC<Props> = (props) => {
  const {
    todo,
    setErrorWithTimer,
    isLoading,
    loadUserTodos,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const user = useContext(AuthContext);

  const setIsLoading = useContext(setIsLoadingContext);

  const handleSuccessfulEdit = useCallback((async () => {
    setIsLoading([todo.id]);
    if (!newTitle && user) {
      await deleteTodo(todo.id)
        .catch(() => {
          setErrorWithTimer(ErrorStatus.DeleteError);
          setIsLoading([]);
        });
      await loadUserTodos();
      setIsLoading([]);
    } else if (newTitle !== todo.title && user) {
      setIsLoading([todo.id]);
      await updateTodo(todo.id, { title: newTitle })
        .catch(() => {
          setErrorWithTimer(ErrorStatus.UpdateError);
          setIsLoading([]);
        });
      await loadUserTodos();
      setIsLoading([]);
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

  const handleCheckboxOnChange = useCallback(async () => {
    setIsLoading([todo.id]);
    if (user) {
      await updateTodo(todo.id, { completed: !todo.completed })
        .catch(() => {
          setErrorWithTimer(ErrorStatus.UpdateError);
          setIsLoading([]);
        });
      await loadUserTodos();
      setIsLoading([]);
    }
  }, [todo, user]);

  const handleDeleteTodo = useCallback(async () => {
    setIsLoading([todo.id]);
    if (user) {
      await deleteTodo(todo.id)
        .catch(() => {
          setErrorWithTimer(ErrorStatus.DeleteError);
          setIsLoading([]);
        });
      await loadUserTodos();
      setIsLoading([]);
    }
  }, [todo, user]);

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames(
          'todo',
          { completed: todo.completed },
        )}
      >
        {isLoading.includes(todo.id) && <Loader />}

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
