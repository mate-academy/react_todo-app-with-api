import React, { memo, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteClick: (todoId: number) => void,
  processingTodo: number[],
  updateTodo: (todoToUpdate: Todo) => void,
  toggleTodoStatus: (id: number, status: boolean) => void,
};

export const TodoElement: React.FC<Props> = memo((props) => {
  const {
    todo,
    handleDeleteClick,
    processingTodo,
    updateTodo,
    toggleTodoStatus,
  } = props;

  const [editingId, setEditingId] = useState(0);
  const [editTodoTitle, setEditTodoTitle] = useState(todo.title);

  const handleEditTodo = () => {
    if (!editTodoTitle) {
      handleDeleteClick(todo.id);
      setEditingId(0);

      return;
    }

    if (todo.title !== editTodoTitle) {
      updateTodo({ ...todo, id: editingId, title: editTodoTitle });
      setEditingId(0);
    }

    setEditingId(0);
  };

  const onCancelEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingId(0);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo', { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => toggleTodoStatus(todo.id, !todo.completed)}
        />
      </label>

      {editingId === todo.id ? (
        <form onSubmit={() => handleEditTodo()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTodoTitle}
            onChange={(event) => setEditTodoTitle(event.target.value)}
            onBlur={() => handleEditTodo()}
            onKeyDown={(event) => onCancelEditing(event)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingId(todo.id)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handleDeleteClick(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': processingTodo.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
