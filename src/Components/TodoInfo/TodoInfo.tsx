import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isAdd?: boolean,
  patchToggleLoader?: null | number,
  deleteTodosId?: number[] | null,
  onDelete?: (idTodo: number) => void,
  onToggle?: (idTodo: number, change: boolean | string) => void,
};

const TodoInfo: FC<Props> = ({
  todo,
  isAdd,
  deleteTodosId,
  patchToggleLoader,
  onDelete,
  onToggle,
}) => {
  const [value, setValue] = useState(todo.title);
  const [isForm, setIsForm] = useState(false);
  const isActiveLoader = isAdd
    || deleteTodosId?.includes(todo.id)
    || patchToggleLoader === todo.id;

  const hendlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const hendlerRemoveItem = () => {
    if (onDelete) {
      onDelete(todo.id);
    }
  };

  const hendlerToggle = () => {
    if (onToggle) {
      onToggle(todo.id, todo.completed);
    }
  };

  const hendlerDoubleClick = () => {
    setIsForm(true);
  };

  const hendlerForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value && onDelete) {
      onDelete(todo.id);

      return;
    }

    if (onToggle) {
      onToggle(todo.id, value);
    }

    setIsForm(false);
  };

  const hendlerKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsForm(false);
      setValue(todo.title);
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', hendlerKeyUp);

    return () => {
      window.removeEventListener('keyup', hendlerKeyUp);
    };
  }, []);

  return (
    <>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onClick={hendlerToggle}
        />
      </label>

      {isForm ? (
        <form
          onSubmit={hendlerForm}
          onBlur={hendlerForm}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder={value || 'Empty todo will be deleted'}
            value={value}
            onChange={hendlerInput}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={hendlerDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={hendlerRemoveItem}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isActiveLoader },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};

export default TodoInfo;
