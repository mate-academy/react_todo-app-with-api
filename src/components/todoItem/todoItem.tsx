import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isProcessed: boolean;
  onDelete: (id: number) => void;
  onUpdate: (data: Partial<Todo>) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete,
  onUpdate,
}) => {
  // Стан для режиму редагування
  const [isEditing, setIsEditing] = useState(false);
  // Стан для тимчасового тексту (щоб не змінювати todo.title відразу)
  const [tempTitle, setTempTitle] = useState(todo.title);

  // Потрібен реф для автофокусу на інпуті
  const editInputRef = useRef<HTMLInputElement>(null);

  // Фокусуємо інпут, коли активується режим редагування
  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const saveChanges = () => {
    // Якщо текст не змінився, просто виходимо
    if (tempTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    // Якщо текст порожній, видаляємо задачу (за стандартом багатьох ToDo)
    if (tempTitle.trim() === '') {
      onDelete(todo.id);

      return;
    }

    // Оновлюємо заголовок
    onUpdate({ title: tempTitle });
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      saveChanges();
    }

    if (event.key === 'Escape') {
      setTempTitle(todo.title); // Повертаємо старий текст
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
    >
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/control-has-associated-label */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate({ completed: !todo.completed })}
        />
      </label>
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            saveChanges();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={tempTitle}
            onChange={e => setTempTitle(e.target.value)}
            onBlur={saveChanges} // Зберігаємо при втраті фокусу
            onKeyDown={handleKeyDown}
            ref={editInputRef}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className={`todo__remove ${isEditing ? 'is-hidden' : ''}`}
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      />

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isProcessed ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
