import React, {
  ChangeEvent,
  FC,
  useCallback,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { patchTodo } from '../../api/todos'
import { ErrorsType } from '../../types/ErrorsType'

interface Props {
  todo: Todo,
  todoId?: number,
  isDeleted?: boolean,
  deleteTodo?: (todo: Todo) => void,
  handleEditTodo: (todo: Todo) => void,
  displayError: (error: ErrorsType) => void,
}

export const TodoItem: FC<Props> = React.memo(({
  todo,
  isDeleted,
  deleteTodo = () => {},
  todoId,
  handleEditTodo = () => {},
  displayError = () => {},
}) => {
  const { completed, title } = todo;
  const isLoad = todo.id === todoId;
  const [isLoading, setIsLoading] = useState(isLoad);
  const [isDisabled, setIsDisabled] = useState(false);

  const handeleDelete = async () => {
    setIsLoading(true);

    await deleteTodo(todo);

    setIsLoading(false);
  };

  const handeleStatus = useCallback(async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    const data = {
      ...todo,
      completed: event.target.checked,
    };

    try {
      setIsDisabled(true);
      setIsLoading(true);

      const editingTodo = await patchTodo(todo.id, data);

      handleEditTodo(editingTodo);
    } catch {
      displayError(ErrorsType.UPDATE);
    }

    setIsDisabled(false);
    setIsLoading(false);
  }, [completed]);

  return (
    <div className={cn('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handeleStatus}
          disabled={isDisabled}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handeleDelete}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoading || isDeleted,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
