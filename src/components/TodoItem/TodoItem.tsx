import {
  ChangeEvent,
  FC, useEffect, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/types';

type Props = {
  todo: Todo;
  activeIds: number[];
  handleRemoveTodo: (buttonId: number) => void;
  handleCheckboxClick: (todo: Todo) => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  activeIds,
  handleRemoveTodo,
  handleCheckboxClick,
}) => {
  const { title, completed, id } = todo;
  const [isCompleted, setIsCompleted] = useState(completed);

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsCompleted(event.target.checked);
  };

  useEffect(() => {
    handleCheckboxClick({
      ...todo,
      completed: isCompleted,
    });
  }, [isCompleted]);

  return (
    <div
      className={cn(
        'todo',
        'item-enter-done',
        { completed: isCompleted },
      )}
      data-cy="todo"
    >
      <div className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={handleStatusChange}
        />
      </div>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleRemoveTodo(id)}
      >
        ×
      </button>

      <div
        className={cn(
          'overlay',
          'modal',
          {
            'is-active': activeIds.some(activeId => activeId === id),
          },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
