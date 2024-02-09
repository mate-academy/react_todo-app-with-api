import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { useTodosContext } from '../TodosContext';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const {
    deleteTodo,
    updateTodo,
    isAdding,
    idsToLoading,
  } = useTodosContext();

  const [titleValue, setTitleValue] = useState(title);
  const [isEdited, setIsEdited] = useState(false);
  const focusTodo = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    focusTodo.current?.focus();
  }, [isEdited]);

  const handleLoaderIsActive = () => {
    return (isAdding && !id) || idsToLoading.includes(id);
  };

  const handleComplete = () => {
    updateTodo({
      ...todo,
      completed: !completed,
    });
  };

  const handleOnEditSubmit = () => {
    if (!titleValue.trim()) {
      deleteTodo(id);

      return;
    }

    setIsEdited(false);

    updateTodo({
      ...todo,
      title: titleValue.trim(),
    });
  };

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setTitleValue(title);
      setIsEdited(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
      onDoubleClick={() => setIsEdited(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleComplete}
        />
      </label>

      {isEdited ? (
        <form
          onSubmit={handleOnEditSubmit}
        >
          <input
            ref={focusTodo}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleValue}
            onChange={event => setTitleValue(event.target.value)}
            onKeyUp={(e) => handleOnKeyUp(e)}
            onBlur={handleOnEditSubmit}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {titleValue}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': handleLoaderIsActive() })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
