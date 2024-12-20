import React, { Dispatch, SetStateAction, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  isLoading?: boolean;
  isEditMode?: boolean;
  setEditedTodoId: Dispatch<SetStateAction<null | number>>;
};

export const TodoCard: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onUpdateTodo,
  isLoading,
  isEditMode,
  setEditedTodoId,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

  const onChangeCheckbox = () => {
    onUpdateTodo({ ...todo, completed: !todo.completed });
  };

  const onChangeTitle = () => {
    setEditedTodoId?.(todo.id);
  };

  const onBlurForm = () => {
    if (todo.title === newTodoTitle.trim()) {
      setEditedTodoId(null);

      return;
    }

    if (newTodoTitle.trim() === '') {
      onDeleteTodo(todo.id);

      return;
    }

    onUpdateTodo({ ...todo, title: newTodoTitle.trim() }).then(() =>
      setEditedTodoId(null),
    );
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onBlurForm();
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);
      setNewTodoTitle(todo.title);
    }
  };

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
        {/* eslint-disable jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={onChangeCheckbox}
          />
        </label>

        {isEditMode ? (
          <form onSubmit={onSubmit}>
            <input
              autoFocus
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              onBlur={onBlurForm}
              onKeyUp={onKeyUp}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={onChangeTitle}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
