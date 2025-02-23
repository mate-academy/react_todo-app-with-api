import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodosContext';
import classNames from 'classnames';
import { delTodo, editTodo, updateTodo } from '../api/todos';

type Props = {
  todo: Todo;
  temp?: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, temp = false }) => {
  const { id, title, completed } = todo;
  const context = useContext(TodosContext);
  const { todos, setTodos, titleField } = context;
  const { setError, setErrorMessage, delTodoFromState } = context;
  const [newTitle, setNewTitle] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const EditTitleField = useRef<HTMLInputElement | null>(null);

  const handlerCompleteTodo = () => {
    const updatedTodos = [...todos];
    const currentTodoIndex = updatedTodos.findIndex((elem: Todo) => {
      return elem.id === id;
    });

    if (currentTodoIndex !== -1) {
      setIsLoading(true);
      setErrorMessage('');

      const newCompleted = !updatedTodos[currentTodoIndex].completed;

      updateTodo(id, {
        completed: newCompleted,
      })
        .then(() => {
          updatedTodos[currentTodoIndex] = {
            ...updatedTodos[currentTodoIndex],
            completed: newCompleted,
          };
          updatedTodos.splice(
            currentTodoIndex,
            1,
            updatedTodos[currentTodoIndex],
          );

          setTodos(updatedTodos);
        })
        .catch(() => {
          setError('Unable to update a todo');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handlerDeleteTodo = () => {
    setIsLoading(true);
    setErrorMessage('');

    delTodo(id)
      .then(() => {
        delTodoFromState(id);
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        if (titleField && titleField.current) {
          titleField.current.focus();
        }

        setIsLoading(false);
      });
  };

  const handlerEditTodo = () => {
    setNewTitle(title);
    setIsEditing(true);
  };

  useEffect(() => {
    if (EditTitleField.current && isEditing) {
      EditTitleField.current.focus();
    }
  }, [isEditing]);

  const handlerEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEditing) {
      if (newTitle.trim()) {
        if (title === newTitle.trim()) {
          setIsEditing(false);
        } else {
          const updatedTodos = [...todos];
          const currentTodoIndex = updatedTodos.findIndex(
            (elem: Todo) => elem.id === id,
          );

          if (currentTodoIndex !== -1) {
            setIsLoading(true);
            setErrorMessage('');

            editTodo(id, {
              title: newTitle.trim(),
            })
              .then(() => {
                updatedTodos[currentTodoIndex] = {
                  ...updatedTodos[currentTodoIndex],
                  title: newTitle.trim(),
                };
                updatedTodos.splice(
                  currentTodoIndex,
                  1,
                  updatedTodos[currentTodoIndex],
                );

                setTodos(updatedTodos);
                setIsEditing(false);
              })
              .catch(() => {
                setError('Unable to update a todo');
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        }
      } else {
        setIsLoading(true);
        setErrorMessage('');

        delTodo(id)
          .then(() => {
            delTodoFromState(id);

            if (isEditing) {
              setIsEditing(false);
            }

            if (titleField && titleField.current) {
              titleField.current.focus();
            }
          })
          .catch(() => {
            setError('Unable to delete a todo');
            if (EditTitleField && EditTitleField.current) {
              EditTitleField.current.focus();
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  };

  const handlerKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <>
      <li
        data-cy="Todo"
        className={cn('todo', {
          completed: completed,
          editing: isEditing,
        })}
        data-id={id}
        onDoubleClick={handlerEditTodo}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={handlerCompleteTodo}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handlerSubmit} onBlur={handlerSubmit}>
            <input
              ref={EditTitleField}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handlerEditTitle}
              onKeyUp={handlerKeyUp}
            />
          </form>
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handlerDeleteTodo}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': temp || isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </li>
    </>
  );
};
