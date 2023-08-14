import {
  FC, useContext, useState, useEffect, FormEvent, useRef,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types';
import { TodoContext } from '../TodoContext';

type Props = {
  todo: Todo;
  isLoading?: boolean;
};

export const TodoInfo: FC<Props> = ({ todo, isLoading = false }) => {
  const {
    selectedTodoIds,
    onDeleteTodo,
    onUpdateTodo,
  } = useContext(TodoContext);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editRef = useRef<HTMLInputElement>(null);

  const isProcessed = selectedTodoIds.includes(todo.id);

  const updateTodoCompleted = (newStatus: boolean) => (
    onUpdateTodo({ ...todo, completed: newStatus })
  );

  const updateTodoTitle = () => {
    if (todo.title === newTitle) {
      return;
    }

    if (!newTitle.trim()) {
      onDeleteTodo(todo.id);

      return;
    }

    onUpdateTodo({ ...todo, title: newTitle });
  };

  const handleEditTodoTitle = (event?: FormEvent) => {
    event?.preventDefault();

    updateTodoTitle();

    setIsEditing(false);
  };

  useEffect(() => {
    const cancelEditing = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setIsEditing(false);
    };

    document.addEventListener('keyup', cancelEditing);

    return () => {
      document.removeEventListener('keyup', cancelEditing);
    };
  }, []);

  useEffect(() => {
    setNewTitle(todo.title);

    if (isEditing && editRef.current) {
      editRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={(event) => updateTodoCompleted(event.target.checked)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditTodoTitle}>
          <input
            ref={editRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleEditTodoTitle}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading || isProcessed,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
