import cn from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { AppContext } from '../../AppContext';

type Props = {
  todo: TodoType
};

export const TodoItem: React.FC<Props> = React.memo(
  ({ todo }) => {
    const {
      deleteTodo,
      selectedTodoIds,
      handleToggleCompleted,
      updateTodo,
    } = useContext(AppContext);

    const [editing, setEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(todo.title);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!newTitle) {
        deleteTodo(todo.id);

        return;
      }

      if (newTitle.trim() === todo.title.trim()) {
        setEditing(false);

        return;
      }

      updateTodo({
        ...todo,
        title: newTitle.trim(),
      });

      setEditing(false);
    };

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (editing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [editing]);

    return (
      <div
        data-cy="Todo"
        className={cn('todo', {
          completed: todo.completed,
        })}
        onDoubleClick={() => setEditing(true)}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onChange={() => handleToggleCompleted(todo)}
            checked={todo.completed}
          />
        </label>

        {editing ? (
          <form
            onSubmit={handleSubmit}
            onBlur={handleSubmit}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Escape') {
                  setEditing(false);
                  setNewTitle(todo.title);
                }
              }}
            />
          </form>
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {newTitle}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': selectedTodoIds.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
