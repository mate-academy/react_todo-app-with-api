import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { EditTodoInput } from '../EditTodoInput';

type Props = {
  todos: Todo[];
  title: string;
  adding: boolean;
  handleDelete: (id: number) => void;
  handleStatusChange: (id: number, data: boolean) => void;
  selectedTodoIds: number[];
  handleEditing: (id: number, data: string, oldData: string) => void;
  handleDoubleClick: (id: number) => void;
  editing: boolean;
  handleCancel: () => void;
};

export const TodosList: React.FC<Props> = (
  {
    todos,
    title,
    adding,
    handleDelete,
    handleStatusChange,
    selectedTodoIds,
    handleEditing,
    handleDoubleClick,
    editing,
    handleCancel,
  },
) => {
  const [editedTitle, setEditedTitle] = useState<string>('');

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              checked={todo.completed}
              className="todo__status"
              onChange={() => {
                return todo.completed
                  ? handleStatusChange(todo.id, false)
                  : handleStatusChange(todo.id, true);
              }}
            />
          </label>

          {editing && selectedTodoIds.some(id => id === todo.id)
            ? (
              <EditTodoInput
                todo={todo}
                editedTitle={editedTitle}
                setEditedTitle={setEditedTitle}
                handleEditing={handleEditing}
                handleCancel={handleCancel}
              />
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditedTitle(todo.title);
                    handleDoubleClick(todo.id);
                  }}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
                  onClick={() => handleDelete(todo.id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={classNames(
                    'modal overlay',
                    {
                      'is-active': selectedTodoIds.some(id => id === todo.id),
                    },
                  )}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </>
            )}
        </div>
      ))}

      {adding && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">{title}</span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
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
