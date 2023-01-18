import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  title: string;
  isAdding: boolean;
  handleDelete: (id: number) => void;
  handleStatusChange: (id: number, data: boolean) => void;
  selectedTodoIds: number[];
  handleEditing: (id: number, data: string, oldData: string) => void;
  handleDoubleClick: (id: number) => void;
};

export const TodosList: React.FC<Props> = (
  {
    todos,
    title,
    isAdding,
    handleDelete,
    handleStatusChange,
    selectedTodoIds,
    handleEditing,
    handleDoubleClick,
  },
) => {
  const [editedTitle, setEditedTitle] = useState<string>(title);

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
              onClick={() => {
                return todo.completed
                  ? handleStatusChange(todo.id, false)
                  : handleStatusChange(todo.id, true);
              }}
            />
          </label>

          {selectedTodoIds.some(id => id === todo.id)
            ? (
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                onChange={e => setEditedTitle(e.target.value)}
                onBlur={() => handleEditing(todo.id, editedTitle, todo.title)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleEditing(todo.id, editedTitle, todo.title);
                  }

                  if (e.key === 'Escape') {
                    handleEditing(todo.id, todo.title, todo.title);
                  }
                }}
                value={editedTitle}
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

      {isAdding && (
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
