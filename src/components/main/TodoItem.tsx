import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { appContext } from '../Context/Context';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const {
    deleteTodoHandler,
    isLoading,
    deleteIds,
    updateTodos,
  } = useContext(appContext);

  const [titleToChange, setTitleToChange] = useState(title);
  const [isEdit, setIsEdit] = useState(false);

  const handlerLoader = () => (isLoading && !todo.id) || deleteIds.includes(id);

  const onSubmit = () => {
    if (titleToChange.trim() === '') {
      deleteTodoHandler(id);

      return;
    }

    setIsEdit(false);

    updateTodos({
      ...todo,
      title: titleToChange,
    });
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEdit(false);
    }
  };

  const handleToReverseCompleteButton = () => {
    updateTodos({
      ...todo,
      completed: !completed,
    });
  };

  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
      onDoubleClick={() => setIsEdit(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToReverseCompleteButton}
        />
      </label>

      {isEdit ? (
        <form onSubmit={onSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleToChange}
            onChange={(event => setTitleToChange(event.target.value))}
            ref={inputRef}
            onBlur={onSubmit}
            onKeyUp={onKeyUp}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodoHandler(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': handlerLoader() })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
