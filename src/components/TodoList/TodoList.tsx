import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { client } from '../../utils/fetchClient';
import { Errors } from '../../types/Errors';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (url: number) => void;
  processingIds: number[];
  tempTodo: Todo | null;
  setErrorMessage: (er: Errors | string) => void;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  processingIds,
  tempTodo,
  setErrorMessage,
  setProcessingIds,
  setTodos,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const startEditind = (todo: Todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (ev: React.FormEvent, todo: Todo) => {
    ev.preventDefault();

    if (editingId === null) {
      return;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmedTitle) {
      deleteTodo(todo.id);

      return;
    }

    setProcessingIds(prev => [...prev, todo.id]);

    try {
      const updatedTodo = await client.patch<Todo>(`/todos/${todo.id}`, {
        title: trimmedTitle,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
      setEditingId(null);
    } catch {
      setErrorMessage(Errors.UnableUpdate);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const hendleChangeCompleted = async (todo: Todo) => {
    setProcessingIds(prev => [...prev, todo.id]);
    try {
      await client.patch(`/todos/${todo.id}`, { completed: !todo.completed });

      setTodos(prevTodos => {
        return prevTodos.map(oldTodo => {
          if (oldTodo.id !== todo.id) {
            return oldTodo;
          }

          return { ...oldTodo, completed: !oldTodo.completed };
        });
      });
    } catch {
      setErrorMessage(Errors.UnableUpdate);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        return (
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
            })}
            key={todo.id}
            onDoubleClick={() => {
              startEditind(todo);
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              className="todo__status-label"
              htmlFor={`todo-status-${todo.id}`}
            >
              <input
                id={`todo-status-${todo.id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {
                  hendleChangeCompleted(todo);
                }}
              />
            </label>
            {editingId !== todo.id ? (
              <>
                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => {
                    deleteTodo(todo.id);
                  }}
                >
                  ×
                </button>
              </>
            ) : (
              <form
                // eslint-disable-next-line max-len
                style={{
                  gridColumn: '2 / -1',
                  width: '100%',
                  display: 'block',
                }}
                onSubmit={ev => handleSubmit(ev, todo)}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  style={{
                    width: '100%',
                    display: 'block',
                    border: 'none',
                    outline: 'none',
                  }}
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={handleTitle}
                  onBlur={ev => handleSubmit(ev, todo)}
                  onKeyUp={ev => {
                    if (ev.key === 'Escape') {
                      setEditingId(null);
                    }
                  }}
                  autoFocus
                />
              </form>
            )}

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div
              data-cy="TodoLoader"
              className={classNames('modal', 'overlay', {
                'is-active': processingIds.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: tempTodo.completed,
          })}
          key={tempTodo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            className="todo__status-label"
            htmlFor={`todo-status-${tempTodo.id}`}
          >
            <input
              id={`todo-status-${tempTodo.id}`}
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

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              deleteTodo(tempTodo.id);
            }}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', {
              'is-active': true,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
