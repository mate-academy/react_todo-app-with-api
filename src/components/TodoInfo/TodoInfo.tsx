import classNames from 'classnames';
import { Dispatch, SetStateAction, useContext } from 'react';
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

  const user = useContext(AuthContext);

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

        <span data-cy="TodoTitle" className="todo__title">
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
      </div>
    </>
  );
};
