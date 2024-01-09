import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onTodoDelete?: (todoId: number) => void;
  onTodoUpdate?: (title: string) => void;
  loadingTodoIds?: number[];
  onToggleTodo?: (todo: Todo) => void;
  isLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onTodoDelete = () => {},
  onTodoUpdate = () => {},
  loadingTodoIds,
  onToggleTodo = () => {},
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const inputFocus = useRef<HTMLInputElement>(null);

  const handleTodoDoubleClick = () => {
    inputFocus.current?.focus();
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todo.title === todoTitle) {
      setIsEditing(false);

      return;
    }

    if (todoTitle) {
      await onTodoUpdate(todoTitle);
    } else {
      await onTodoDelete(todo.id);
    }

    setIsEditing(false);
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const onKeyUpHandle = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div
        data-cy="Todo"
        className={classNames('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onClick={() => onToggleTodo(todo)}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleTodoSave} onBlur={handleTodoSave}>
            <input
              onKeyUp={onKeyUpHandle}
              data-cy="TodoTitleField"
              type="text"
              ref={inputFocus}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTodoTitleChange}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onTodoDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal',
            'overlay', {
              'is-active': loadingTodoIds?.includes(todo.id) || isLoading,
            },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
