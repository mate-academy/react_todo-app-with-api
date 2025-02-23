/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Actions } from '../../types/Actions';
import { filteredTodos } from '../../utils/filteredTodos';
import React, { useEffect, useRef, useState } from 'react';
import * as postServise from '../../api/todos';

type Props = {
  todos: Todo[];
  actions: Actions;
  loading: { [key: number]: boolean };
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  handleLoading: (id: number, type: string) => void;
  updateTodosFormServer: (todo: Todo) => void;
  errorNotification: (message: string) => void;
};
export const ListOfTodos: React.FC<Props> = ({
  todos,
  actions,
  loading,
  onDelete,
  tempTodo,
  handleLoading,
  updateTodosFormServer,
  errorNotification,
}) => {
  const [isEditTodo, setIsEditTodo] = useState<{
    [id: number]: boolean;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const inputRefFocus = useRef<HTMLInputElement>(null);
  const returnEditionRef = useRef<(e: KeyboardEvent) => void>(() => {});

  const updatedTodo = (newTodo: Todo) => {
    handleLoading(newTodo.id, 'turnOn');
    postServise
      .updateTodos(newTodo)
      .then(updateTodo => {
        const todo = updateTodo as Todo;

        updateTodosFormServer(todo);
        setEditTitle('');
        setIsEditTodo(null);
        setIsEditing(false);
      })
      .catch(() => {
        errorNotification('Unable to update a todo');
      })
      .finally(() => {
        handleLoading(newTodo.id, 'turnOff');
      });
  };

  const handleCompleted = (id: number) => {
    const index = todos.findIndex(todo => id === todo.id);
    const newTodo = {
      ...todos[index],
      completed: todos[index].completed ? false : true,
    };

    updatedTodo(newTodo);
  };

  useEffect(() => {
    const returnEdition = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        setEditTitle('');
        setIsEditTodo(null);
        setIsEditing(false);
      }
    };

    returnEditionRef.current = returnEdition;

    if (isEditTodo) {
      window.addEventListener('keyup', returnEditionRef.current);
    }

    return () => {
      if (returnEditionRef.current) {
        window.removeEventListener('keyup', returnEditionRef.current);
      }
    };
  }, [isEditTodo]);

  const handleEditTodo = (id: number, title: string) => {
    setIsEditTodo(null);
    setIsEditTodo({ [id]: true });
    setEditTitle(title);
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && inputRefFocus.current) {
      inputRefFocus.current.focus();
    }
  }, [isEditing]);

  const handleInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.currentTarget.value);
  };

  const submitEditTitle = (id: number) => {
    const index = todos.findIndex(todo => id === todo.id);

    if (todos[index].title === editTitle) {
      setEditTitle('');
      setIsEditTodo(null);
      setIsEditing(false);

      return;
    }

    if (editTitle.length === 0) {
      onDelete(id);

      return;
    }

    const newTodo = {
      ...todos[index],
      title: editTitle.trim(),
    };

    updatedTodo(newTodo);
  };

  const handleBlur = (id: number) => {
    submitEditTitle(id);
  };

  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos(todos, actions).map(({ id, title, completed }) => (
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: completed,
              })}
              key={id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={completed}
                  onChange={() => handleCompleted(id)}
                />
              </label>

              {(isEditTodo === null || isEditTodo[id] === undefined) && (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => handleEditTodo(id, title)}
                  >
                    {title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => onDelete(id)}
                  >
                    ×
                  </button>
                </>
              )}
              {isEditTodo !== null && isEditTodo[id] && (
                <form
                  key={id}
                  onSubmit={e => {
                    e.preventDefault();
                    submitEditTitle(id);
                  }}
                >
                  {isEditing && (
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      ref={inputRefFocus}
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={editTitle}
                      onChange={handleInputTitle}
                      onBlur={() => handleBlur(id)}
                    />
                  )}
                </form>
              )}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': loading[id],
                })}
              >
                <div
                  className="modal-background
                    has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: tempTodo.completed,
              })}
              key={tempTodo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={tempTodo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(tempTodo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': loading[tempTodo.id],
                })}
              >
                <div
                  className="modal-background
                    has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};
