import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (todoId: number) => void;
  isDeletingCompleted: boolean;
  editTodo: (todoId: number, fieldToChange: object) => Promise<void>;
  isTodoChanging: boolean;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  removeTodo,
  isDeletingCompleted,
  editTodo,
  isTodoChanging,
}) => {
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [checkBoxClicked, setChekboxClicked] = useState(false);
  const { title, completed, id } = todo;

  const handleDelete = () => {
    setDeleteButtonClicked(true);
    removeTodo(id);
  };

  const handleTodoStatus = async () => {
    setChekboxClicked(true);
    await editTodo(id, { completed: !completed });
    setChekboxClicked(false);
  };

  const loaderIsActive = (id === 0 || deleteButtonClicked)
    || (isDeletingCompleted && completed)
    || (isTodoChanging && checkBoxClicked);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleTodoStatus}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': loaderIsActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
