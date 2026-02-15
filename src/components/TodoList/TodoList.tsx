/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { patchTodos } from '../../api/todos';
import { ErrorMessage } from '../../types/Errors';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (id: number) => void;
  isPosting: boolean;
  deletingTodoId: number | null;
  toggledTodo: (id: number, completed: boolean) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (value: string) => void;
  updatingTodoId: number | null;
  setUpdatingTodoId: (value: number | null) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  tempTodo,
  isPosting,
  toggledTodo,
  setTodos,
  setErrorMessage,
  updatingTodoId,
  setUpdatingTodoId,
  deletingTodoId,
}) => {
  const [editingID, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = async (todo: Todo) => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === '') {
      setUpdatingTodoId(todo.id);

      try {
        await handleDeleteTodo(todo.id);
      } catch {
        setErrorMessage(ErrorMessage.UpdateTodo);
        inputRef.current?.focus();
      } finally {
        setUpdatingTodoId(null);
      }

      return;
    }

    if (trimmedTitle === todo.title) {
      setEditingId(null);

      return;
    }

    setEditingId(todo.id);
    setUpdatingTodoId(todo.id);

    try {
      const updatedTodo = await patchTodos(todo.id, {
        ...todo,
        title: trimmedTitle,
      });

      setTodos(prev =>
        prev.map(newTodo => (newTodo.id === todo.id ? updatedTodo : newTodo)),
      );

      setEditingId(null);
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodo);
      inputRef.current?.focus();
    } finally {
      setUpdatingTodoId(null);
    }
  };

  useEffect(() => {
    if (editingID) {
      inputRef.current?.focus();
    }
  }, [editingID]);

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <div
            data-cy="Todo"
            className={`todo ${todo.completed ? 'completed' : ''}`}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onClick={() => toggledTodo(todo.id, todo.completed)}
                readOnly
              />
            </label>

            {editingID === todo.id ? (
              <>
                <input
                  ref={inputRef}
                  data-cy="TodoTitleField"
                  className="todo__edit todo__title"
                  value={editTitle}
                  onChange={event => setEditTitle(event.target.value)}
                  onBlur={() => handleSave(todo)}
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      handleSave(todo);
                    }

                    if (event.key === 'Escape') {
                      setEditingId(null);
                      setEditTitle(todo.title);
                    }
                  }}
                />
                <div
                  data-cy="TodoLoader"
                  className={classNames('modal', 'overlay', {
                    'is-active': updatingTodoId === todo.id,
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </>
            ) : (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setEditingId(todo.id);
                  setEditTitle(todo.title);
                }}
              >
                {todo.title}
              </span>
            )}

            {!(editingID === todo.id) && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active':
                  updatingTodoId === todo.id ||
                  deletingTodoId === todo.id ||
                  isPosting,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

        {tempTodo && (
          <div className="todo" data-cy="Todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" disabled />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <div
              data-cy="TodoLoader"
              className={`modal overlay ${isPosting ? 'is-active' : ''}`}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </section>
    </>
  );
};
