import cn from 'classnames';
import { FC, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  deleteTodoByID: (arg: number) => void;
  editTodoByID: (id: number, data: Partial<Todo>) => Promise<boolean>;
}

export const TodoItem:FC<Props> = ({
  todo,
  deleteTodoByID,
  editTodoByID,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { title, completed, id } = todo;

  const isTemporaryTodo = id === 0;

  const onHandleRemoveTodo = async () => {
    setIsLoading(true);
    await deleteTodoByID(id);
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
        'is-active': isLoading || isTemporaryTodo,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
