import React, { useCallback, useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoEditForm } from './TodoEditForm/TodoEditForm';
import { TodoListContext } from '../../context/TodoListContext';

type Props = {
  todo: Todo,
  isProcessing: boolean,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  isProcessing = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');

  const {
    handleToggleButtonClick,
    handleRemoveButtonClick,
  } = useContext(TodoListContext);
  const { id, title, completed } = todo;

  const handleDoubleClick = useCallback((event: React.SyntheticEvent) => {
    const taskTitle = event.currentTarget.textContent;

    if (taskTitle) {
      setTodoTitle(taskTitle);
    }

    setIsEditing(true);
  }, []);

  const exitEditionMode = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleToggle = useCallback(() => {
    handleToggleButtonClick(id, completed);
  }, [id, completed]);

  const handleRemove = useCallback(() => {
    handleRemoveButtonClick(todo.id);
  }, [handleRemoveButtonClick, todo.id]);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={handleToggle}
        />
      </label>

      {isEditing ? (
        <TodoEditForm
          todoId={id}
          todoTitle={todoTitle}
          exitEditionMode={exitEditionMode}
        />
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleRemove}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal', 'overlay', {
        'is-active': isProcessing,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
