import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onToggledTodo: (todo: Todo) => void;
  onDelete: (id: number) => Promise<boolean>;
  onUpdateTodo: (todo: Todo) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  onToggledTodo,
  onDelete,
  onUpdateTodo,
}) => {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const visibleTodos = [...todos, ...(tempTodo ? [tempTodo] : [])];
  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTodo(prev => (prev ? { ...prev, title: e.target.value } : prev));
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setEditingTodo(null);
    }

    if (e.key === 'Enter') {
      if (editingTodo === null) {
        return;
      }

      inputRef.current?.blur();
    }
  };

  const handleSaveEdited = async () => {
    if (!editingTodo) {
      return;
    }

    if (loadingTodoIds.includes(editingTodo.id)) {
      return;
    }

    const original = todos.find(t => t.id === editingTodo.id);

    if (!original) {
      setEditingTodo(null);

      return;
    }

    const newTitle = editingTodo.title.trim();

    if (newTitle === original.title) {
      setEditingTodo(null);

      return;
    }

    if (newTitle === '') {
      const success = await onDelete(editingTodo.id);

      if (success) {
        setEditingTodo(null);
      }

      return;
    }

    const success = await onUpdateTodo({
      ...editingTodo,
      title: newTitle,
    });

    if (success) {
      setEditingTodo(null);
    }
  };

  useEffect(() => {
    if (editingTodo) {
      inputRef.current?.focus();
    }
  }, [editingTodo]);

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {visibleTodos.map(todo => (
          <div
            data-cy="Todo"
            className={classNames('todo', { completed: todo.completed })}
            key={todo.id}
          >
            <label className="todo__status-label" aria-label="Toggle todo">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => onToggledTodo(todo)}
              />
            </label>
            {editingTodo?.id === todo.id ? (
              <input
                data-cy="TodoTitleField"
                ref={inputRef}
                className="todo__title todo__title-field"
                value={editingTodo?.title}
                onBlur={handleSaveEdited}
                onChange={handleChangeTitle}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => setEditingTodo({ ...todo })}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => onDelete(todo.id)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active':
                  loadingTodoIds.includes(todo.id) || tempTodo?.id === todo.id,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}
      </section>
    </>
  );
};
