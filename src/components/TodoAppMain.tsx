/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React, { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

interface TodoAppMainProps {
  visibleTodos: Todo[];
  onUpdate: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  isCreating: boolean;
  tempTodo: Todo | null;
  todoIsLoading: { [id: number]: boolean };
}

export const TodoAppMain: React.FC<TodoAppMainProps> = ({
  visibleTodos,
  onUpdate,
  onDelete,
  isCreating,
  tempTodo,
  todoIsLoading,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const handleTodoEdit = (todo: Todo, newTitle: string): void => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle && trimmedTitle !== todo.title) {
      setEditingTodoId(null);
      onUpdate({ ...todo, title: trimmedTitle });
    } else if (!trimmedTitle) {
      onDelete(todo.id);
    } else {
      setEditingTodoId(null);
    }
  };

  const handleStartEdit = (todo: Todo): void => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleCancelEdit = (): void => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const handleToggleCompleted = (todo: Todo): void => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  const handleFormSubmit = (e: React.FormEvent, todo: Todo): void => {
    e.preventDefault();
    handleTodoEdit(todo, editingTitle);
  };

  const handleInputBlur = (todo: Todo): void => {
    handleTodoEdit(todo, editingTitle);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const isCurrentlyEditing = (todoId: number): boolean => {
    return editingTodoId === todoId;
  };

  const isTodoLoading = (todoId: number): boolean => {
    return todoIsLoading[todoId] || false;
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <div
          key={todo.id}
          className={classNames('todo', { completed: todo.completed })}
          data-cy="Todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleToggleCompleted(todo)}
            />
          </label>

          {isCurrentlyEditing(todo.id) ? (
            <form onSubmit={e => handleFormSubmit(e, todo)}>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                value={editingTitle}
                onChange={e => setEditingTitle(e.target.value)}
                onBlur={() => handleInputBlur(todo)}
                onKeyDown={handleKeyDown}
                disabled={isCreating}
                autoFocus
              />
            </form>
          ) : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleStartEdit(todo)}
            >
              {todo.title}
            </span>
          )}

          {!isCurrentlyEditing(todo.id) && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
              disabled={isTodoLoading(todo.id)}
            >
              ×
            </button>
          )}

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': isTodoLoading(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {/* Temp Todo */}
      {tempTodo && (
        <div className="todo" data-cy="Todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              disabled
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" disabled>
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
