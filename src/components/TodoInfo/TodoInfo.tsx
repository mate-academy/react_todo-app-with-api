import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { TodoLoader } from '../TodoLoader';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isAdding?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  onSetTodoIdForDelete?: (todo: number) => void;
  onSetTodoForUpdate?: (todo: Todo) => void;
};

export const TodoInfo: React.FC<Props> = React.memo(
  ({
    todo,
    isAdding,
    isDeleting,
    isUpdating,
    onSetTodoIdForDelete,
    onSetTodoForUpdate,
  }) => {
    const {
      id,
      userId,
      title,
      completed,
    } = todo;

    const todoTitleField = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [updatedTodoTitle, setUpdatedTodoTitle] = useState(title);

    useEffect(() => {
      if (todoTitleField.current) {
        todoTitleField.current.focus();
      }
    }, [isEditing]);

    const handleClickTodoDeleteButton = () => {
      if (onSetTodoIdForDelete) {
        onSetTodoIdForDelete(id);
      }
    };

    const handleClickTodoStatusToggle = () => {
      if (onSetTodoForUpdate) {
        onSetTodoForUpdate(todo);
      }
    };

    const handleDoubleClickSetEditing = () => setIsEditing(true);

    const handleChangeUpdatedTodoTitle = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => (
      setUpdatedTodoTitle(event.currentTarget.value)
    );

    const handleEscKeyDownCancelEditing = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setUpdatedTodoTitle(title);
      }
    };

    const saveRenamedTodo = () => {
      if (updatedTodoTitle === title) {
        setIsEditing(false);

        return;
      }

      if (!updatedTodoTitle && onSetTodoIdForDelete) {
        onSetTodoIdForDelete(id);
        setIsEditing(false);
        setUpdatedTodoTitle(title);

        return;
      }

      const renamedTodo: Todo = {
        id,
        userId,
        title: updatedTodoTitle,
        completed: !completed,
      };

      if (onSetTodoForUpdate) {
        onSetTodoForUpdate(renamedTodo);
        setIsEditing(false);
      }
    };

    const handleSubmitRenameTodo = (event: React.FormEvent) => {
      event.preventDefault();

      saveRenamedTodo();
    };

    return (
      <div
        data-cy="Todo"
        className={cn(
          'todo',
          { completed },
        )}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked={completed}
            onClick={handleClickTodoStatusToggle}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleSubmitRenameTodo}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={todoTitleField}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedTodoTitle}
              onChange={handleChangeUpdatedTodoTitle}
              onBlur={saveRenamedTodo}
              onKeyDown={handleEscKeyDownCancelEditing}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClickSetEditing}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleClickTodoDeleteButton}
            >
              ×
            </button>
          </>
        )}

        <TodoLoader isLoading={isAdding || isDeleting || isUpdating} />
      </div>
    );
  },
);
