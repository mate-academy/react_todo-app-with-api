import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

interface MainProps {
  todos: (Todo & { loading?: boolean })[];
  filteredTodos: (Todo & { loading?: boolean })[];
  toggleTodo: (id: number) => void;
  deleteTodoItem: (id: number) => void;
  updateTodoTitle: (
    id: number,
    title: string,
    setEditingId: (id: number | null) => void,
  ) => void;
  loading: boolean;
}

export const Main: React.FC<MainProps> = ({
  filteredTodos,
  toggleTodo,
  deleteTodoItem,
  updateTodoTitle,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId !== null) {
      inputRef.current?.focus();
    }
  }, [editingId]);

  const handleSave = (todo: Todo) => {
    const trimmed = editingTitle.trim();

    if (trimmed !== todo.title) {
      // Якщо title порожній або змінений — передаємо до App
      updateTodoTitle(todo.id, trimmed, setEditingId);
    } else {
      // Якщо нічого не змінилось — закриваємо редагування
      setEditingId(null);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        const checkboxId = `todo-${todo.id}`;
        const isEditing = editingId === todo.id;

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', { completed: todo.completed })}
          >
            <input
              id={checkboxId}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              disabled={todo.loading}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-for */}
            <label
              className="todo__status-label"
              htmlFor={checkboxId}
              aria-label="Toggle todo"
            ></label>

            {isEditing ? (
              <input
                ref={inputRef}
                data-cy="TodoTitleField"
                value={editingTitle}
                onChange={e => setEditingTitle(e.target.value)}
                onBlur={() => handleSave(todo)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSave(todo);
                  }

                  if (e.key === 'Escape') {
                    setEditingTitle(todo.title);
                    setEditingId(null);
                  }
                }}
                className="todo-edit"
              />
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setEditingId(todo.id);
                  setEditingTitle(todo.title);
                }}
              >
                {todo.title}
              </span>
            )}

            <Loader isActive={!!todo.loading} />

            {!isEditing && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodoItem(todo.id)}
                disabled={todo.loading}
              >
                ×
              </button>
            )}
          </div>
        );
      })}
    </section>
  );
};
