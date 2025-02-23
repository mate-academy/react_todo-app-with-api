/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { FormTodoTitle } from '../FormTodoTitle/FormTodoTitle';

type Props = {
  todo: Todo;
  onToggle?: (toggledTodo: Todo) => void;
  onTitleChange?: (todo: Todo, newTitle: string) => Promise<void | Todo>;
  isTodoLoading?: boolean;
  onDelete?: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = memo(function TodoItem({
  todo,
  onToggle = () => {},
  onTitleChange = () => {},
  isTodoLoading = false,
  onDelete = () => {},
}) {
  const todoRef = useRef<HTMLDivElement>(null);
  const [isTodoEditing, setIsTodoEditing] = useState(false);

  useEffect(() => {
    const todoDiv = todoRef.current;

    const startTodoEditiong = () => {
      setIsTodoEditing(true);
    };

    const stopTodoEditing = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTodoEditing(false);
      }
    };

    todoDiv?.addEventListener('dblclick', startTodoEditiong);

    document.addEventListener('keyup', stopTodoEditing);

    return () => {
      todoDiv?.removeEventListener('dblclick', startTodoEditiong);

      document.removeEventListener('keyup', stopTodoEditing);
    };
  }, []);

  const handleTitleChange = (currentTodo: Todo, newTitle: string) => {
    if (!newTitle) {
      onDelete(currentTodo.id);

      return;
    }

    return onTitleChange(currentTodo, newTitle)
      ?.then(() => {
        setIsTodoEditing(false);
      })
      .catch(() => {
        throw Error();
      });
  };

  return (
    <div
      ref={todoRef}
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
          checked={todo.completed}
          onChange={e => {
            onToggle({
              ...todo,
              completed: e.target.checked,
            });
          }}
        />
      </label>

      {isTodoEditing ? (
        <FormTodoTitle todo={todo} onTitleChange={handleTitleChange} />
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
