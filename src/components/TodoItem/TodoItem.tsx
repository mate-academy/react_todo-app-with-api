import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (n: number) => void,
  updateTodo: (t: Todo) => void,
  todosIdsAreLoading: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  updateTodo,
  todosIdsAreLoading,
}) => {
  const { id, completed, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const editindField = useRef<HTMLInputElement | null>(null);
  const isLoading = todosIdsAreLoading.includes(todo.id);

  useEffect(() => {
    if (isEditing && editindField.current) {
      editindField.current.focus();
    }
  }, [isEditing]);

  const handleEditTodo = (ev: React.FormEvent) => {
    ev.preventDefault();

    if (newTitle.trim() === title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle.trim()) {
      deleteTodo(id);
      setIsEditing(false);

      return;
    }

    updateTodo({ ...todo, title: newTitle });
    setIsEditing(false);
  };

  const handleKeyUp = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={cn('todo', { completed, editing: isEditing })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => updateTodo({ ...todo, completed: !completed })}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleEditTodo}>
            <input
              type="text"
              data-cy="TodoTitleField"
              className="todo__title-field"
              value={newTitle}
              ref={editindField}
              onChange={(ev) => setNewTitle(ev.target.value)}
              onBlur={handleEditTodo}
              onKeyUp={(ev) => handleKeyUp(ev)}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
