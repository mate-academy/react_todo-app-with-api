import React, { useState } from 'react';
import { Todo } from '../types/Todo';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, title: string) => void;
  deletingTodos?: number[];
  updatingTodos?: number[];
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  deletingTodos = [],
  updatingTodos = [],
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const todosToDisplay = tempTodo ? [...todos, tempTodo] : todos;

  const handleDoubleClick = (todo: Todo) => {
    setEditingId(todo.id);
    setEditValue(todo.title);
  };

  const handleSave = async () => {
    if (!editingId) return;

    const trimmedValue = editValue.trim();
    const currentTodo = todos.find(t => t.id === editingId);

    if (currentTodo && trimmedValue === currentTodo.title) {
      setEditingId(null);
      return;
    }

    try {
      if (trimmedValue) {
        await updateTodo(editingId, trimmedValue);
      } else {
        await deleteTodo(editingId);
      }
      setEditingId(null);
      setEditValue('');
    } catch {
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleSave();
    else if (event.key === 'Escape') setEditingId(null);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToDisplay.map(todo => {
        const isTemp = todo.id === 0 || (todo as any).isTemp;
        const isDeleting = deletingTodos.includes(todo.id);
        const isUpdating = updatingTodos.includes(todo.id);
        const showLoader = isTemp || isDeleting || isUpdating;

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={`todo ${todo.completed ? 'completed' : ''} ${editingId === todo.id ? 'editing' : ''}`}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                disabled={isTemp || isDeleting}
              />
            </label>

            {editingId === todo.id ? (
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                autoFocus
              />
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => !isTemp && handleDoubleClick(todo)}
                >
                  {todo.title}
                </span>
                {!isTemp && (
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => deleteTodo(todo.id)}
                    disabled={isDeleting}
                  >
                    ×
                  </button>
                )}
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={`modal overlay${showLoader ? ' is-active' : ''}`}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
