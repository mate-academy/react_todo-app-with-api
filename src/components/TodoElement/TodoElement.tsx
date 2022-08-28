import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { EditTodo } from '../EditTodo';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  isLoading: boolean,
  handleRemoveTodo: (id: number) => void,
  handleChangeTodo: (id: number, data: {}) => void,
  isLoadingSomeTodo: boolean,
}

export const TodoElement: React.FC<Props> = React.memo(({
  todo,
  isLoading,
  handleRemoveTodo,
  handleChangeTodo,
  isLoadingSomeTodo,
}) => {
  const { id, title, completed } = todo;

  const [isDoubleClick, setIsDoubleClick] = useState(false);

  const handleActionTodo = useCallback((newTitle: string) => {
    setIsDoubleClick(false);
    if (!newTitle) {
      handleRemoveTodo(id);
    } else if (newTitle !== todo.title) {
      handleChangeTodo(id, { title: newTitle });
    }
  }, [handleRemoveTodo, handleChangeTodo]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => handleChangeTodo(id, { completed: !completed })}
        />
      </label>

      {isDoubleClick ? (
        <EditTodo title={title} handleActionTodo={handleActionTodo} />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsDoubleClick(!isLoadingSomeTodo)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleRemoveTodo(id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', { 'is-active': isLoading })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
});
