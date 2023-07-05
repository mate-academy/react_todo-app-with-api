import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  loadingTodoIds: number[];
  onDelete: CallableFunction;
  handleUpdateTodo: (
    todoId: number,
    newTodoData: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodoIds,
  onDelete,
  handleUpdateTodo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleEdited, setIsTitleEdited] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const { id, title, completed } = todo;

  const inputReference = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(loadingTodoIds.includes(id));
  }, [loadingTodoIds, id]);

  useEffect(() => {
    if (isTitleEdited) {
      inputReference.current?.focus();
    }
  }, [isTitleEdited]);

  const handleDoubleClick = () => {
    setIsTitleEdited(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsTitleEdited(false);
    }
  };

  const handleTodoEditing = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpdateTodo(todo.id, { title: newTitle });
    setIsTitleEdited(false);
  };

  const handleOnBlur = () => {
    handleUpdateTodo(todo.id, { title: newTitle });
    setIsTitleEdited(false);
  };

  const handleToggleComplete = () => {
    handleUpdateTodo(id, { completed: !todo.completed });
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handleToggleComplete}
        />
      </label>

      {isTitleEdited ? (
        <form onSubmit={handleTodoEditing}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleOnBlur}
            onKeyUp={handleKeyUp}
            ref={inputReference}
          />
        </form>
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
            onClick={() => onDelete(id)}
            disabled={isLoading}
          >
            ×
          </button>

          <div className={classNames('modal overlay', {
            'is-active': loadingTodoIds.includes(id),
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
