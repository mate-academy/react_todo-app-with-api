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
  setVisibleTodos: Dispatch<SetStateAction<Todo[] | null>>,
  setErrorWithTimer: (message: string) => void;
  isLoading: string,
  setIsLoading: Dispatch<SetStateAction<string>>,
}

export const TodoInfo: React.FC<Props> = (props) => {
  const {
    todo,
    setVisibleTodos,
    setErrorWithTimer,
    isLoading,
    setIsLoading,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const user = useContext(AuthContext);

  const handleSuccessfulEdit = ((todoId: number, title: string) => {
    if (!newTitle) {
      deleteTodo(todoId);
    } else if (newTitle !== title) {
      updateTodo(todoId, { title: newTitle });
    }

    setIsEditing(false);
  });

  const handlePressEsc = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewTitle(todo.title);
      }
    }, [],
  );

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      if (event.detail === 2) {
        setIsEditing(true);
      }
    }, [],
  );

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
            onChange={() => {
              setIsLoading(String(todo.id));
              // setIsLoading(todo.title);
              if (user) {
                updateTodo(todo.id, { completed: !todo.completed })
                  .then(() => getTodos(user.id))
                  .then(todos => setVisibleTodos(todos))
                  .then(() => setIsLoading(''))

                  .catch(() => {
                    setErrorWithTimer(ErrorStatus.UpdateError);
                    setIsLoading('');
                  });
              }
            }}
          />
        </label>

        {isEditing
          ? (
            <form
              onSubmit={event => {
                event.preventDefault();
                handleSuccessfulEdit(todo.id, todo.title);
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onChange={event => setNewTitle(event.target.value)}
                onBlur={() => handleSuccessfulEdit(todo.id, todo.title)}
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
                onClick={() => {
                  setIsLoading(String(todo.id));
                  if (user) {
                    deleteTodo(todo.id)
                      .then(() => getActiveTodos(user.id))
                      .then(userTodos => {
                        setVisibleTodos(userTodos);
                        setIsLoading('');
                      })

                      .catch(() => {
                        setErrorWithTimer(ErrorStatus.DeleteErrod);
                        setIsLoading('');
                      });
                  }
                }}
              >
                ×
              </button>
            </>
          )}

      </div>
    </>
  );
};
