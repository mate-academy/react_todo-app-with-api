import { FC, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { memo } from 'react';
import TodoEditForm from '../TodoEditForm/TodoEditForm';

type Props = {
  todo: Todo;
  onDeleteTodo?: (id: number) => void;
  isTodoTemp?: boolean;
  isLoadingTodo: boolean;
  toggleOneTodo?: (todo: Todo) => void;
  editTodoTitle?: (todoId: number, title: string) => void;
};

const TodoItem: FC<Props> = ({
  todo,
  isTodoTemp,
  onDeleteTodo,
  isLoadingTodo,
  toggleOneTodo,
  editTodoTitle,
}) => {
  const { title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            toggleOneTodo?.(todo);
          }}
        />
      </label>

      {isEditing ? (
        <TodoEditForm
          title={title}
          todoId={todo.id}
          setIsEditing={setIsEditing}
          editTodoTitle={editTodoTitle}
          onDeleteTodo={onDeleteTodo}
        />
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          {!isTodoTemp && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDeleteTodo?.(todo.id)}
            >
              ×
            </button>
          )}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTodoTemp || isLoadingTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default memo(TodoItem);
