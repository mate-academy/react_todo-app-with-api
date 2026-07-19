import React from 'react';
import { Todo } from '../../types/Todo';
interface Props {
  todo: Todo;
  isProcessed: boolean; // Очікуємо вже обчислений булевий стан
  onDelete: () => void;
  // Додаємо onUpdate. Функція приймає об'єкт з полями, які потрібно оновити (наприклад, { completed: true })
  onUpdate: (data: Partial<Todo>) => void;
}
export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete,
  onUpdate,
}: Props) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        {' '}
        {/* Додаємо htmlFor */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          id={`todo-${todo.id}`} // Додаємо унікальний id для input
          onChange={() => onUpdate({ completed: !todo.completed })}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDelete}
      >
        ×
      </button>
      {/* Оверлей з лоадером */}
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
