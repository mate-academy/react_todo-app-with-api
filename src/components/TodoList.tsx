/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TypeNewTodo } from '../App';
import { useState } from 'react';

export interface Props {
  todos: Todo[];
  LoderId: number;
  visibleTodos: Todo[];
  NewTodo: TypeNewTodo | null;
  showLoaderCurrentPatch: number[];
  toggleAll: (n: number, v: boolean) => void;
  showLoader: (n: number) => void;
  deletePost: (n: number) => void;
  uppdatePost: (valuePost: string, id: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  visibleTodos,
  showLoaderCurrentPatch,
  NewTodo,
  LoderId,
  showLoader,
  toggleAll,
  uppdatePost,
  deletePost,
}) => {
  const [isEditing, setIsEditing] = useState<number>(-1);
  const [editedTitle, setEditedTitle] = useState<string>('');

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0 &&
        visibleTodos.map(todo => {
          return (
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames('todo', {
                completed: todo.completed === true,
              })}
            >
              <label
                className="todo__status-label"
                htmlFor={`status-${todo.id}`}
              >
                <input
                  type="checkbox"
                  data-cy="TodoStatus"
                  id={`status-${todo.id}`}
                  className="todo__status"
                  onChange={e => toggleAll(todo.id, e.target.checked)}
                  checked={todo.completed}
                />
              </label>

              {isEditing === todo.id ? (
                <input
                  autoFocus
                  type="text"
                  data-cy="TodoTitleField"
                  className="todo__title"
                  value={editedTitle} // Якщо залишити Value  трибут  не контрольованим то React  не бачить подію блур.
                  onKeyUp={e => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }

                    if (e.key === 'Escape') {
                      setIsEditing(-1);
                    }
                  }}
                  onChange={e => {
                    setEditedTitle(e.target.value);
                  }}
                  onBlur={async e => {
                    const newValue = e.currentTarget.value.trim();

                    if (newValue === '') {
                      showLoader(todo.id);
                      deletePost(todo.id);

                      return;
                    }

                    if (newValue !== todo.title) {
                      try {
                        await uppdatePost(newValue, todo.id);
                        setIsEditing(-1); // ← тільки якщо успішно
                      } catch (error) {
                        throw new Error('Update failed');
                      }
                    } else {
                      setIsEditing(-1); // нічого не змінилось — закриваємо
                    }
                  }}
                />
              ) : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => {
                      setIsEditing(todo.id);
                      setEditedTitle(todo.title);
                    }}
                  >
                    {todo.title}
                  </span>

                  <div
                    data-cy="TodoLoader"
                    className={classNames('modal overlay', {
                      'is-active': showLoaderCurrentPatch.includes(todo.id),
                    })}
                  >
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </>
              )}

              {isEditing !== todo.id && (
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => {
                    showLoader(todo.id);
                    deletePost(todo.id);
                  }}
                  data-cy="TodoDelete"
                >
                  ×
                </button>
              )}

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active':
                    LoderId === todo.id ||
                    showLoaderCurrentPatch.includes(todo.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
        })}

      {NewTodo && (
        <div data-cy="Todo" className="todo">
          <label htmlFor="esseso" className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              id="esseso"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {NewTodo.title}
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
