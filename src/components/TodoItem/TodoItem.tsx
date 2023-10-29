import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ToggleType } from '../../types/ToggleType';

type Props = {
  todo: Todo,
  isClearCompleted: boolean,
  toggleType: ToggleType,
  onDeleteTodo: (todoId: number) => void,
  onChangeStatus: (todoId: number, todoStatus: boolean) => void,
  onChangeTitle: (todoId: number, todoTitle: string) => void,
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

  const editInputRef = useRef<HTMLInputElement>(null);

  const [editingTitle, setEditingTitle] = useState(title);
  const [isEdit, setIsEdit] = useState(false);

  const saveChanges = async () => {
    setIsLoading(true);

    if (!editingTitle.trim()) {
      await onDeleteTodo(id);
    } else if (editingTitle !== title) {
      await onChangeTitle(id, editingTitle);
    }

    // if (editingTitle !== title) {
    //   await onChangeTitle(id, editingTitle);
    // }

    setIsLoading(false);
    setIsEdit(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveChanges();
  };

  const handleChangeStatus
  = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await onChangeStatus(todo.id, !todo.completed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDeleteTodo(id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAll = async () => {
    setIsLoading(true);

    try {
      if (!completed && toggleType === ToggleType.ToggleOn) {
        await onChangeStatus(id, true);
      }

      if (completed && toggleType === ToggleType.ToggleOff) {
        await onChangeStatus(id, false);
      }
    } finally {
      setIsLoading(false);
      setToggleType(ToggleType.None);
    }
  };

  const handleEditingKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEdit(false);
      setEditingTitle(title);
    }
  };

  const handleBlur = () => {
    if (isEdit) {
      saveChanges();
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
    if (editInputRef.current) {
      editInputRef.current.focus();
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
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={(event) => setEditingTitle(event.target.value)}
            onKeyUp={handleEditingKeyUp}
            onBlur={handleBlur}
            ref={editInputRef}
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
