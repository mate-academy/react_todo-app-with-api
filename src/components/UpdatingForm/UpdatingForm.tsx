import { useEffect, useRef, useState } from 'react';

import cn from 'classnames';

import { Todo } from '../../types/Todo';

import { USER_ID } from '../../helpers/userId';

type Props = {
  onUpdateInputFocus: (value: boolean) => void,
  onCheckedToggle: (value: Todo) => void,
  onUpdatingForm: (value: Todo | null) => void,
  onSubmit: (value: Todo) => Promise<void>,
  onDelete: (value: number) => void,

  isTodoLoading: Todo | null,
  query: string,
  todo: Todo,
};

export const UpdatingForm: React.FC<Props> = ({
  onUpdateInputFocus,
  onCheckedToggle,
  onUpdatingForm,
  onSubmit,
  onDelete,

  isTodoLoading,
  todo,
}) => {
  const [updatedQuery, setUpdatedQuery] = useState(todo.title);

  const textField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textField.current) {
      textField.current.focus();
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    onUpdateInputFocus(true);

    event.preventDefault();

    if (updatedQuery === todo.title) {
      onUpdatingForm(null);

      return;
    }

    if (!updatedQuery) {
      onDelete(todo.id);
    } else {
      onSubmit({
        id: todo?.id,
        userId: USER_ID,
        title: updatedQuery.trim(),
        completed: todo.completed,
      }).then(() => onUpdatingForm(null))
        .catch((error) => error);
    }
  };

  const handleEscacpe = (event: React.KeyboardEvent) => {
    if (event.keyCode === 27) {
      onUpdatingForm(null);
    }

    if (event.keyCode === 13 && updatedQuery === todo.title) {
      onUpdatingForm(null);
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', {
          'todo completed': todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onClick={() => onCheckedToggle(todo)}
          />
        </label>

        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            onBlur={handleSubmit}
            onKeyUp={handleEscacpe}
            ref={textField}
            value={updatedQuery}
            onChange={(event) => setUpdatedQuery(event.target.value)}
          />
        </form>

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isTodoLoading?.id === todo.id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
