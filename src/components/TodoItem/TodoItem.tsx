import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { changeTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  tempTodoId?: number;
  handleChangeTodo: (updatingTodo: Todo) => void;
  setErrorMessage: (errorMessage: string) => void;
  deleteTodo?: (id: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  tempTodoId,
  handleChangeTodo = () => {},
  setErrorMessage,
  deleteTodo = () => {},
}) => {
  const { title, completed } = todo;

  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(tempTodoId === todo.id);
  const [isEdit, setIsEdit] = useState(false);
  const [titleForEdit, setTitleForEdit] = useState(title);

  const handleStatusChange = useCallback(async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    const todoData = {
      ...todo,
      completed: event.target.checked,
    };

    try {
      setIsDisabled(true);
      setIsLoading(true);

      const updatingTodo = await changeTodo(todo.id, todoData);

      handleChangeTodo(updatingTodo);
    } catch {
      setErrorMessage('Unable to update todo');
    }

    setIsDisabled(false);
    setIsLoading(false);
  }, [completed]);

  const handleTitleEdit = useCallback(async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    if (!titleForEdit.trim()) {
      deleteTodo(todo);

      return;
    }

    if (title === titleForEdit) {
      setIsEdit(false);

      return;
    }

    const todoData = {
      ...todo,
      title: titleForEdit,
    };

    try {
      setIsEdit(true);
      setIsLoading(true);

      const updatingTodo = await changeTodo(todo.id, todoData);

      handleChangeTodo(updatingTodo);
    } catch {
      setErrorMessage('Unable to change todo');
    }

    setIsLoading(false);
    setIsEdit(false);
  }, [titleForEdit]);

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusChange}
          disabled={isDisabled}
        />
      </label>

      {isEdit ? (
        <form onSubmit={handleTitleEdit}>
          <input
            type="text"
            placeholder="Empty todo will be deleted"
            className="todo__title-field"
            value={titleForEdit}
            onChange={(event) => setTitleForEdit(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEdit(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={async () => {
              setIsLoading(true);
              deleteTodo?.(todo);
            }}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
