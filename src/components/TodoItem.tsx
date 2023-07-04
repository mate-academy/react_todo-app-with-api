import cn from 'classnames';
import { FC, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  removeTodoByID: (arg: number) => void;
  editTodoByID: (id: number, data: Partial<Todo>) => Promise<boolean>;
  isLoadingNow: boolean;
}

export const TodoItem:FC<Props> = ({
  todo,
  removeTodoByID,
  editTodoByID,
  isLoadingNow,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { title, completed, id } = todo;

  const onHandleRemoveTodo = async () => {
    setIsLoading(true);
    await removeTodoByID(id);
    setIsLoading(false);
  };

  const toggleCheckboxHandler = async () => {
    setIsLoading(true);
    await editTodoByID(id, { completed: !completed });
    setIsLoading(false);
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={toggleCheckboxHandler}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={onHandleRemoveTodo}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoading || isLoadingNow,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
