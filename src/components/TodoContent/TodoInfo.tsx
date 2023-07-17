import {
  FC, ChangeEvent, useContext, useState, useEffect, FormEvent, useRef,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
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

  const editRef = useRef<HTMLInputElement | null>(null);

  const isProcessed = selectedTodoIds.includes(todo.id);

  const updateTodoCompleted = (event: ChangeEvent<HTMLInputElement>) => {
    const todoForUpdate: Todo = {
      ...todo,
      completed: event.target.checked,
    };

    onUpdateTodo(todoForUpdate);
  };

  const updateTodoTitle = () => {
    if (todo.title === newTitle) {
      return;
    }

    if (!newTitle) {
      onDeleteTodo(todo.id);

      return;
    }

    const todoForUpdate: Todo = {
      ...todo,
      title: newTitle,
    };

    onUpdateTodo(todoForUpdate);
  };

  const handleEditTodoTitle = (event?: FormEvent) => {
    event?.preventDefault();

    updateTodoTitle();

    setIsEditing(false);
  };

  useEffect(() => {
    const cancelEditing = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewTitle(todo.title);
      }
    };

    document.addEventListener('keyup', cancelEditing);

    return () => {
      document.removeEventListener('keyup', cancelEditing);
    };
  }, []);

  useEffect(() => {
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
          onChange={updateTodoCompleted}
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
