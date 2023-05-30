import React, { ChangeEventHandler, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo,
  onDeleteTodo: (todoId: number) => void,
  isProcessed: boolean,
  onToggleCompleted?: ChangeEventHandler<HTMLInputElement>,
  onUpdateTodoTitle: (todoId: number, newTitle: string) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isProcessed,
  onToggleCompleted,
  onUpdateTodoTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleTitleChange = () => {
    if (editedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!editedTitle) {
      onDeleteTodo(todo.id);
    }

    setIsEditing(false);

    onUpdateTodoTitle(todo.id, editedTitle);
  };

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    handleTitleChange();
  };

  const onBlurHandler = () => {
    handleTitleChange();
  };

  const onKeyUpHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={onToggleCompleted}
        />
      </label>

      {isEditing ? (
        <form onSubmit={formSubmitHandler}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={onBlurHandler}
            onKeyUp={onKeyUpHandler}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <button
            className="todo__title"
            type="button"
            onDoubleClick={() => setIsEditing(true)}
          >
            {editedTitle}
          </button>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {isProcessed && <Loader />}
    </div>
  );
};
