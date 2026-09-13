import React from 'react';
import { Filter } from './Filters';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  filter: Filter;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  processing: number[];
  handleToggle: (todo: Todo) => void;
  editingTodoId: number | null;
  startEditingTodo: (todo: Todo) => void;
  newTitle: string;
  setNewTitle: (title: string) => void;
  saveEditingTodo: (todo: Todo) => void;
  setEditingTodoId: (id: number | null) => void;
};

export const FilteredTodos: React.FC<Props> = ({
  filter,
  todos,
  onDelete,
  tempTodo,
  processing,
  handleToggle,
  editingTodoId,
  startEditingTodo,
  newTitle,
  setNewTitle,
  saveEditingTodo,
  setEditingTodoId,
}) => {
  const filteredTodos = todos.filter(item => {
    if (filter === 'active') {
      return !item.completed;
    }

    if (filter === 'completed') {
      return item.completed;
    }

    return true;
  });

  return (
    <>
      {filteredTodos.map(tod => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: tod.completed })}
          key={tod.id}
        >
          <label
            className="todo__status-label"
            aria-label="What needs to be done?"
          >
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tod.completed}
              onChange={() =>
                handleToggle({ ...tod, completed: !tod.completed })
              }
            />
          </label>

          {editingTodoId === tod.id ? (
            <input
              data-cy="TodoTitleField"
              className="todo__title-field"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onBlur={() => saveEditingTodo(tod)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  saveEditingTodo(tod);
                }

                if (e.key === 'Escape') {
                  setEditingTodoId(null);
                }
              }}
              autoFocus
            />
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => startEditingTodo(tod)}
              >
                {tod.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(tod.id)}
              >
                ×
              </button>
            </>
          )}
          <div
            data-cy="TodoLoader"
            className={`modal overlay ${processing.includes(tod.id) ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo temp" key={tempTodo.id}>
          <label
            className="todo__status-label"
            aria-label="What needs to be done?"
          >
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              readOnly
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <div
            data-cy="TodoLoader"
            className={`modal overlay ${processing.includes(tempTodo.id) ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
