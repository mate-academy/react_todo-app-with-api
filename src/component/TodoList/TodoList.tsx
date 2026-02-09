/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem'; // Імпортуємо новий компонент

interface Props {
  todos: Todo[];
  tempTodos: number[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => void;
  onRename: (todo: Todo, newTitle: string) => void; // Додали пропс
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodos,
  tempTodo,
  onDelete,
  onUpdate,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessing={tempTodos.includes(todo.id)}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onRename={onRename}
        />
      ))}

      {/* Temp Todo залишається тут або теж можна винести в компонент, але він простий */}
      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove">
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
