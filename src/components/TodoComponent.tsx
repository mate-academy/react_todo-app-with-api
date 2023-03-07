import {
  FC,
  ChangeEvent,
  Dispatch,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { CustomError } from '../types/CustomError';
import { updateTodo } from '../api/todos';

type Props = {
  completed: boolean,
  title: string,
  id: number,
  onRemove: (id: number) => void,
  todos: Todo[],
  setTodos: Dispatch<React.SetStateAction<Todo[]>>,
  setError: (newError: CustomError, delay?: number) => void,
};

export const TodoComponent: FC<Props> = ({
  completed,
  title,
  id,
  onRemove,
  todos,
  setTodos,
  setError,
}) => {
  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    const data = { completed: e.target.checked };
    const currentTodo = todos.find((todo: Todo) => todo.id === id);

    if (currentTodo) {
      const index = todos.indexOf(currentTodo);

      setTodos((prevState) => {
        return [
          ...prevState.slice(0, index),
          {
            ...currentTodo,
            id: 0,
          },
          ...prevState.slice(index + 1, prevState.length),
        ];
      });

      updateTodo(id, data)
        .then((response: Todo) => {
          setTodos(prevState => {
            return [
              ...prevState.slice(0, index),
              {
                ...response,
              },
              ...prevState.slice(index + 1, prevState.length),
            ];
          });
        })
        .catch(() => setError(CustomError.Update));
    } else {
      setError(CustomError.Update);
    }
  };

  return (
    <div
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusChange}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onRemove(id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal',
        'overlay',
        { 'is-active': !id },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
