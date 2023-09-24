import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { CurrentError } from '../../types/CurrentError';
import { ToggleType } from '../../types/ToggleType';

type Props = {
  todo: Todo,
  isClearCompleted: boolean,
  toggleType: ToggleType,
  onDeleteTodo: (todoId: number) => void,
  onChangeStatus: (todoId: number, todoStatus: boolean) => void,
  onChangeTitle: (todoId: number, todoTitle: string) => void,
  onSetErrorMessage: (error: CurrentError) => void,
  setIsClearCompleted: (isClearCompleted: boolean) => void,
  setToggleType: (toggleType: ToggleType) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isClearCompleted,
  toggleType,
  onDeleteTodo,
  onChangeStatus,
  onChangeTitle,
  setIsClearCompleted,
  setToggleType,
}) => {
  const {
    id,
    completed,
    title,
  } = todo;
  const [isLoading, setIsLoading] = useState(false);

  const editInput = useRef<HTMLInputElement>(null);

  const [editingTitle, setEditingTitle] = useState(title);
  const [isEdit, setIsEdit] = useState(false);

  const saveChange = () => {
    if (!editingTitle.trim()) {
      onDeleteTodo(id);
    } else if (editingTitle !== title) {
      onChangeTitle(id, editingTitle);
    }

    setIsEdit(false);
  };

  const handleChangeStatus
  = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setIsLoading(true);

    await onChangeStatus(todo.id, !todo.completed);

    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);

    await onDeleteTodo(id);

    setIsLoading(false);
  };

  const handleToggleAll = async () => {
    setIsLoading(true);

    if (!completed && toggleType === ToggleType.ToggleOn) {
      await onChangeStatus(id, true);
    } else if (completed && toggleType === ToggleType.ToggleOff) {
      await onChangeStatus(id, false);
    }

    setIsLoading(false);
    setToggleType(ToggleType.None);
  };

  const handleEditingKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEdit(false);
      setEditingTitle(title);
    }

    if (event.key === 'Enter') {
      saveChange();
    }
  };

  const handleBlur = () => {
    if (isEdit) {
      saveChange();
    }
  };

  useEffect(() => {
    if (completed && isClearCompleted) {
      handleDelete();
    }

    setIsClearCompleted(false);
  }, [isClearCompleted]);

  useEffect(() => {
    handleToggleAll();
  }, [toggleType]);

  useEffect(() => {
    if (editInput.current) {
      editInput.current.focus();
    }
  }, [isEdit]);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
          editing: isEdit,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeStatus}
        />
      </label>

      {isEdit ? (
        <form
          onSubmit={
            (event: React.FormEvent<HTMLFormElement>) => event.preventDefault()
          }
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={(event) => setEditingTitle(event.target.value)}
            onKeyUp={handleEditingKeyUp}
            onBlur={handleBlur}
            ref={editInput}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => setIsEdit(true)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
