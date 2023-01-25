import React, { memo, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteClick: (todoId: number) => void,
  processingTodoIds: number[],
  updateTodo: (todoToUpdate: Todo) => void,
  toggleTodoStatus: (id: number, status: boolean) => void,
};

export const TodoItem: React.FC<Props> = memo((props) => {
  const {
    todo,
    handleDeleteClick,
    processingTodoIds,
    updateTodo,
    toggleTodoStatus,
  } = props;

  const [editingId, setEditingId] = useState(0);
  const [editTodoTitle, setEditTodoTitle] = useState(todo.title);

  const handleEditingTodo = () => {
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
        <form onSubmit={() => handleEditingTodo()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTodoTitle}
            onChange={(e) => setEditTodoTitle(e.target.value)}
            onBlur={() => handleEditingTodo()}
            onKeyDown={(e) => onCancelEditing(e)}
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
          'is-active': processingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
