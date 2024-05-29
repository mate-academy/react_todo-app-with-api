import React, { useCallback, useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { DispatchContext, TodoContext } from './TodoContext';
import classNames from 'classnames';
import { deleteTodoFromServer, updateTodo, USER_ID } from '../api/todos';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
};

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const { dispatch, resetErrorMessage } = useContext(DispatchContext);
  const { todos, isLoading, isLoadingItems } = useContext(TodoContext);
  const [isSaving, setIsSaving] = useState(false); // Новый флаг
  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked;

    dispatch({
      type: 'setItemLoading',
      payload: { id: todo.id, isLoading: true },
    });

    updateTodo({
      id: todo.id,
      userId: USER_ID,
      title: todo.title,
      completed: newStatus,
      isLoading: todo.isLoading,
    })
      .then(updatedTodo => {
        dispatch({
          type: 'updateTodo',
          payload: { updatedTodo },
        });
      })
      .catch(() => {
        dispatch({
          type: 'setError',
          payload: { errorMessage: 'Unable to update a todo' },
        });
      })

      .finally(() => {
        dispatch({
          type: 'setItemLoading',
          payload: { id: todo.id, isLoading: false },
        });

        setTimeout(() => {
          dispatch({ type: 'clearError' });
        }, 3000);
      });
  };

  const deleteTodo = useCallback(() => {
    dispatch({
      type: 'setItemLoading',
      payload: { id: todo.id, isLoading: true },
    });

    deleteTodoFromServer(todo.id)
      .then(() => {
        dispatch({
          type: 'deleteTodo',
          payload: { id: todo.id },
        });

        setIsEditing(false);
      })

      .catch(() => {
        dispatch({
          type: 'setError',
          payload: { errorMessage: 'Unable to delete a todo' },
        });

        resetErrorMessage();
      })
      .finally(() => {
        dispatch({
          type: 'setItemLoading',
          payload: { id: todo.id, isLoading: false },
        });

        setIsSaving(false);
      });
  }, [dispatch, todo, resetErrorMessage]);

  const saveChanges = useCallback(() => {
    setIsSaving(true);
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle) {
      dispatch({
        type: 'setItemLoading',
        payload: { id: todo.id, isLoading: true },
      });

      updateTodo({
        id: todo.id,
        userId: USER_ID,
        title: trimmedTitle,
        completed: todo.completed,
        isLoading: todo.isLoading,
      })
        .then(() => {
          dispatch({
            type: 'updateTodo',
            payload: { updatedTodo: { ...todo, title: trimmedTitle } },
          });

          setIsEditing(false);
        })

        .catch(() => {
          dispatch({
            type: 'setError',
            payload: { errorMessage: 'Unable to update a todo' },
          });

          resetErrorMessage();
        })
        .finally(() => {
          dispatch({
            type: 'setItemLoading',
            payload: { id: todo.id, isLoading: false },
          });

          setIsSaving(false);
        });
    } else {
      deleteTodo();
    }
  }, [dispatch, editedTitle, todo, deleteTodo, resetErrorMessage]);

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (todo.title !== editedTitle) {
          saveChanges();
        } else {
          setIsEditing(false);
        }
      }

      if (e.key === 'Escape') {
        setIsEditing(false);
        setEditedTitle(todo.title);
      }
    },
    [todo.title, editedTitle, saveChanges],
  );

  const handleClick = (todoDelete: Todo) => {
    const currentTodos = [...todos];

    dispatch({
      type: 'setItemLoading',
      payload: { id: todoDelete.id, isLoading: true },
    });

    deleteTodoFromServer(todo.id)
      .catch(error => {
        dispatch({
          type: 'setError',
          payload: { errorMessage: 'Unable to delete a todo' },
        });

        dispatch({
          type: 'setTodos',
          payload: currentTodos,
        });

        throw error;
      })

      .then(() => {
        dispatch({ type: 'deleteTodo', payload: { id: todoDelete.id } });
      })

      .finally(() => {
        dispatch({
          type: 'setItemLoading',
          payload: { id: todoDelete.id, isLoading: false },
        });
      });
  };

  return (
    <>
      {todo && (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={handleCheckBoxChange}
            />
          </label>

          {isEditing ? (
            <form onSubmit={e => e.preventDefault()}>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
                onBlur={() => {
                  if (!isSaving) {
                    saveChanges();
                  }
                }}
                onKeyUp={handleKeyUp}
                autoFocus
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => setIsEditing(true)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleClick(todo)}
              >
                ×
              </button>
            </>
          )}

          <Loader loading={isLoadingItems[todo.id] || isLoading} />
        </div>
      )}
    </>
  );
};
