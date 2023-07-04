import React, {
  ChangeEvent,
  FC,
  useCallback,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { patchTodo } from '../../api/todos';
import { ErrorsType } from '../../types/ErrorsType';

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
  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

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

  const handleDoubleClick = () => {
    setIsEdit(true);
  };

  const finishEdit = () => {
    setIsEdit(false);
    setEditTitle(title);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(event.target.value);
  };

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!editTitle.trim()) {
      deleteTodo(todo);

      return;
    }

    if (editTitle === title) {
      finishEdit();

      return;
    }

    const updatedTodo = {
      ...todo,
      title: editTitle,
    };

    handleEditTodo(updatedTodo);
    setIsEdit(false);
  };

  return (
    <div
      className={cn('todo', {
        completed,
        editing: isEdit,
      })}
      onDoubleClick={handleDoubleClick}
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

      {isEdit ? (
        <form
          onSubmit={handleTitleSubmit}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={handleTitleChange}
            onKeyUp={(event) => {
              if (event.key === 'Escape') {
                finishEdit();
              }
            }}
            onBlur={handleTitleSubmit}
          />
        </form>
      )
        : (
          <>
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
          </>

        )}

    </div>
  );
});
