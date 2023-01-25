import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodoContext } from '../../store/todoContext';
import { TodoLoader } from './TodoLoader';

type Props = {
  todo: Todo;
};

export const TodoItem: FC<Props> = ({ todo }) => {
  const { deleteSingleTodo, toggleTodo } = useTodoContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const todoToggle = () => {
    toggleTodo(todo.id);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={todoToggle}
        />
      </label>
      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => deleteSingleTodo(todo.id, setIsDeleting)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input onBlur={() => setIsEditing(false)} />
        </form>
      )}

      <TodoLoader
        isDeleting={isDeleting}
        todo={todo}
      />
    </div>
  );
};
