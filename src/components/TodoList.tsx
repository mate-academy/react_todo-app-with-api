// /* eslint-disable jsx-a11y/label-has-associated-control */
// /* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodosIds: number[];
  onDelete: (id: number) => void;
  updatingTodoIds: number[];
  onUpdateTodoStatus: (
    todo: Todo,
    dataToUpdate: Partial<Todo>,
  ) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodosIds,
  onDelete,
  updatingTodoIds,
  onUpdateTodoStatus,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const editFieldRef = useRef<HTMLInputElement | null>(null);

  const handleEditSubmit = async (
    event: React.FormEvent | React.FocusEvent,
    todo: Todo,
  ) => {
    event.preventDefault();
    // setEditingTodoId(null);
    const trimedTitle = editTitle.trim();

    if (trimedTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    if (!trimedTitle) {
      onDelete(todo.id);

      return;
    }

    try {
      await onUpdateTodoStatus(todo, { title: trimedTitle });

      setEditingTodoId(null);
    } catch (error) {}
  };

  const handleEditClick = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditTitle(todo.title);
  };

  useEffect(() => {
    if (editFieldRef !== null) {
      editFieldRef.current?.focus();
    }
  }, [editingTodoId]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={`todo ${todo.completed ? 'completed' : ''}`}
        >
          <label className="todo__status-label" aria-label="Toggle todo status">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() =>
                onUpdateTodoStatus(todo, { completed: !todo.completed })
              }
            />
          </label>

          {todo.id === editingTodoId ? (
            <input
              ref={editFieldRef}
              type="text"
              className="todo__title-field"
              data-cy="TodoTitleField"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyUp={e => {
                if (e.key === 'Escape') {
                  setEditingTodoId(null);
                }

                if (e.key === 'Enter') {
                  handleEditSubmit(e, todo);
                }
              }}
              onBlur={ev => handleEditSubmit(ev, todo)}
            />
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleEditClick(todo)}
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
            className={`modal overlay ${
              deletingTodosIds.includes(todo.id) ||
              updatingTodoIds.includes(todo.id)
                ? 'is-active'
                : ''
            }`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label
            className="todo__status-label"
            aria-label="label-has-associated-control"
          >
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
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
