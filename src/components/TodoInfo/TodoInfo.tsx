import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo
  onRemove: (todoId: number) => void
  onTodoUpdate: (todo: Todo) => void
  isUpdating: boolean
};

export const TodoInfo: React.FC<Props> = (
  {
    todo,
    onRemove,
    onTodoUpdate,
    isUpdating,
  },
) => {
  const todoTitleField = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [updatedTodoTitle, setUpdatedTodoTitle] = useState(todo.title);

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClickEditTitle = () => setIsEditing(true);

  const handleEscKeyDownCancelEditing = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setUpdatedTodoTitle(todo.title);
    }
  };

  const saveRenamedTodo = () => {
    if (updatedTodoTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!updatedTodoTitle) {
      onRemove(todo.id);
      setIsEditing(false);
      setUpdatedTodoTitle(todo.title);

      return;
    }

    const renamedTodo: Todo = {
      id: todo.id,
      userId: todo.userId,
      title: updatedTodoTitle,
      completed: !todo.completed,
    };

    onTodoUpdate(renamedTodo);
    setIsEditing(false);
  };

  const handleSubmitRenameTodo = (event: React.FormEvent) => {
    event.preventDefault();

    saveRenamedTodo();
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => onTodoUpdate(todo)}
        />
      </label>
      {isEditing
        ? (
          <form onSubmit={handleSubmitRenameTodo}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={todoTitleField}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedTodoTitle}
              onChange={(e) => setUpdatedTodoTitle(e.currentTarget.value)}
              onBlur={saveRenamedTodo}
              onKeyDown={handleEscKeyDownCancelEditing}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClickEditTitle}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onRemove(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <Loader isLoading={isUpdating} />
    </div>
  );
};
