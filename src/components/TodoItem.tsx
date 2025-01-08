/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  handleDelete: (id: number, onSuccess?: () => void) => Promise<void>;
  tempTodo: Todo | null;
  handleToggle: (todoId: number, completed: boolean) => Promise<void>;
  handleUpdateTitle: (
    todoId: number,
    newTitle: string,
    onSuccess?: () => void,
  ) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleDelete,
  tempTodo,
  handleToggle,
  handleUpdateTitle,
}) => {
  const isLoading = tempTodo?.id === todo.id;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const editFieldRef = useRef<HTMLInputElement>(null);

  // Якщо переходимо в режим редагування, після рендера зробимо фокус
  useEffect(() => {
    if (isEditing && editFieldRef.current) {
      editFieldRef.current.focus();
    }
  }, [isEditing]);

  // Функція збереження назви
  const saveTitle = async () => {
    const trimmedTitle = title.trim();

    // Якщо заголовок не змінився
    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    // Видалення, якщо заголовок порожній
    if (!trimmedTitle) {
      try {
        setIsUpdating(true);
        await handleDelete(todo.id, () => {
          setIsEditing(false);
        });
      } catch {
        // Помилка, залишаємо режим редагування
      } finally {
        setIsUpdating(false);
      }

      return;
    }

    // Оновлення назви
    try {
      setIsUpdating(true);
      await handleUpdateTitle(todo.id, trimmedTitle, () => {
        setIsEditing(false);
      });
    } catch {
      // Помилка, залишаємо режим редагування
    } finally {
      setIsUpdating(false);
    }
  };

  // Подвійний клік => вмикаємо режим редагування
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Зберегти зміни при Enter або скасувати при Escape
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      await saveTitle();
    } else if (event.key === 'Escape') {
      setTitle(todo.title);
      setIsEditing(false);
    }
  };

  // Зберегти при втраті фокусу
  const handleBlur = async () => {
    await saveTitle();
  };

  return (
    <div className={`todo ${todo.completed ? 'completed' : ''}`} data-cy="Todo">
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading}
          onChange={() => handleToggle(todo.id, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <input
          ref={editFieldRef}
          type="text"
          className="todo__title-field"
          data-cy="TodoTitleField"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={isLoading || isUpdating}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleEdit}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() =>
            handleDelete(todo.id, () => {
              setIsEditing(false);
            })
          }
          disabled={isLoading}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          isLoading || isUpdating ? 'is-active' : ''
        }`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
