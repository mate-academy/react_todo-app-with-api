import cn from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';
import { TodoTitleField } from '../TodoTitleField';

type Props = {
  todo: Todo,
  isAdding?: boolean,
  isDeleting?: boolean,
  onDelete?: (todoId: number) => void,
  onUpdate?: (chosenTodo: Todo) => void,
  isUpdating?: boolean | Todo,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  isDeleting,
  onDelete,
  onUpdate,
  isUpdating,
}) => {
  const { title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  const handleUpdateToggle = () => {
    if (onUpdate !== undefined) {
      onUpdate(todo);
    }
  };

  const handleDeleteTodo = () => {
    if (onDelete !== undefined) {
      onDelete(todo.id);
    }
  };

  const renameTitle = () => {
    if (currentTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!currentTitle && onDelete) {
      onDelete(todo.id);
      setIsEditing(false);
      setCurrentTitle(title);

      return;
    }

    const renamedTodo: Todo = {
      ...todo,
      title: currentTitle,
      completed: !completed,
    };

    if (onUpdate) {
      onUpdate(renamedTodo);
      setIsEditing(false);
    }
  };

  const handleOnSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    renameTitle();
  };

  const onBlur = () => {
    setIsEditing(false);

    renameTitle();
  };

  const handleEscKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setCurrentTitle(title);

      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed },
      )}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={handleUpdateToggle}
        />
      </label>

      {isEditing
        ? (
          <TodoTitleField
            onSubmit={handleOnSubmit}
            currentTitle={currentTitle}
            setCurrentTitle={setCurrentTitle}
            onBlur={onBlur}
            onKeyDown={handleEscKeyDown}
          />
        )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleDeleteTodo}
            >
              ×
            </button>
          </>
        )}

      <TodoLoader
        isActive={isAdding}
        isDeleting={isDeleting}
        isUpdating={isUpdating}
      />
    </div>
  );
};
