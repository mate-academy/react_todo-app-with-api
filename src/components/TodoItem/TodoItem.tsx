import React, {
  ChangeEvent,
  FormEvent,
  memo,
  useCallback,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  onChangeCompleted: (todoId: number, completed: boolean) => void;
  onUpdateTitle: (todoId: number, title: string) => void;
}

export const TodoItem: React.FC<Props> = memo(({
  todo,
  deleteTodo,
  onChangeCompleted,
  onUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleChangeCompleted = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChangeCompleted(todo.id, event.target.checked);
    }, [todo.id, onChangeCompleted],
  );

  const handleDeleteTodo = useCallback(() => deleteTodo(todo.id), [todo.id]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setNewTitle(todo.title);
  }, [todo.title]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    onUpdateTitle(todo.id, newTitle);
  }, [todo.id, newTitle, onUpdateTitle]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
      onUpdateTitle(todo.id, newTitle);
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  }, [todo.id, newTitle, onUpdateTitle]);

  const handleTitleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      setIsEditing(false);

      if (newTitle.trim()) {
        onUpdateTitle(todo.id, newTitle);
        updateTodo(todo.id, { title: newTitle });
      } else {
        deleteTodo(todo.id);
      }
    }, [todo.id, newTitle, onUpdateTitle, deleteTodo],
  );

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeCompleted}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleTitleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => {
              setNewTitle(event.target.value);
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteTodo}
          >
            ×
          </button>

          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
