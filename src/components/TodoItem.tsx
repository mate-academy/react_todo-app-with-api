import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onCompletedChange?: (todoId: number) => void,
  onDeleteTodo: (todoId: number) => void,
  isLoading: boolean,
  onUpdateTodo: (todoTitle: string) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onCompletedChange = () => {},
  onDeleteTodo,
  isLoading,
  onUpdateTodo,
}) => {
  const { title, id } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(title);

  const checkHandler = (event: React.FormEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onCompletedChange(todo.id);
  };

  const onDeleteClick = () => {
    onDeleteTodo(id);
  };

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle) {
      onUpdateTodo(todoTitle);
    } else {
      onDeleteTodo(id);
    }

    setIsEditing(false);
  };

  const handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <div
      className={classNames('todo',
        { completed: todo.completed })}
      data-cy="Todo"
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={checkHandler}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleTodoSave}
            onBlur={handleTodoSave}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTodoChange}
            />
          </form>
        )
        : (
          <>
            <span
              onDoubleClick={handleTodoDoubleClick}
              data-cy="TodoTitle"
              className="todo__title"
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={onDeleteClick}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          { 'is-active': isLoading })}
      >
        <div
          className="modal-background
           has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
