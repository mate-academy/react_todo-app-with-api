import { FC, memo, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  deletingTodosId: number[];
  onToggleTodoStatus: (id: number, status: boolean) => void;
  changeTodoTitle: (id: number, title: string) => void;
}

export const TodoItem: FC<Props> = memo(({
  todo,
  onDelete,
  deletingTodosId,
  onToggleTodoStatus,
  changeTodoTitle,
}) => {
  const [editingId, setEditingId] = useState(0);
  const [
    editingTodoTitleQuery,
    setEditingTodoTitleQuery,
  ] = useState(todo.title);

  const handleEditingTodo = () => {
    if (!editingTodoTitleQuery) {
      onDelete(todo.id);
      setEditingId(0);

      return;
    }

    if (todo.title !== editingTodoTitleQuery) {
      changeTodoTitle(editingId, editingTodoTitleQuery);
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
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => onToggleTodoStatus(todo.id, !todo.completed)}
        />
      </label>

      {editingId === todo.id ? (
        <form onSubmit={() => handleEditingTodo()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            // defaultValue={todo.title}
            value={editingTodoTitleQuery}
            onChange={(e) => setEditingTodoTitleQuery(e.target.value)}
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
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': deletingTodosId.includes(todo.id) })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
});
