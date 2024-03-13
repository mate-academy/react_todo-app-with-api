import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { DispatchContext } from '../TodosContext/TodosContext';
import { deleteTodo, updateTodo } from '../../../api/todos';

export const TodoItem = React.memo(({ todo }: { todo: Todo }) => {
  const dispatch = useContext(DispatchContext);
  const [editing, setEditing] = useState(false);
  const [inputText, setInputText] = useState(todo.title || '');
  const inputRefEdit = useRef<HTMLInputElement>(null);

  const handleDelete = () => {
    dispatch({
      type: 'loading',
      payload: { load: true, id: todo.id || 0 },
    });
    deleteTodo(todo.id)
      .then(() => {
        dispatch({ type: 'deleteTodo', payload: todo.id });
        dispatch({ type: 'setIsTodoDeleted', payload: true });
      })
      .catch(() => {
        dispatch({
          type: 'loading',
          payload: { load: false, id: todo.id || 0 },
        });
        dispatch({
          type: 'setError',
          payload: 'Unable to delete a todo',
        });
      })
      .finally(() => {
        dispatch({
          type: 'loading',
          payload: { load: false, id: todo.id || 0 },
        });

        const timeout = setTimeout(() => {
          dispatch({ type: 'setError', payload: null });
          clearTimeout(timeout);
        }, 3000);
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent | { key: 'Enter' }) => {
    switch (event.key) {
      case 'Enter':
        if (todo.title.trim() === inputText.trim()) {
          setEditing(false);

          return;
        }

        if (!inputText.trim()) {
          handleDelete();
        } else {
          const updatedTodo = {
            id: todo.id,
            userId: todo.userId,
            title: inputText.trim(),
            completed: todo.completed,
            loading: false,
          };

          dispatch({
            type: 'loading',
            payload: { load: true, id: updatedTodo.id || 0 },
          });
          if (inputText.trim()) {
            updateTodo(updatedTodo)
              .then(() => {
                setEditing(false);
                dispatch({ type: 'editTodo', payload: updatedTodo });
              })
              .catch(() => {
                setInputText(todo.title || '');
                dispatch({
                  type: 'setError',
                  payload: 'Unable to update a todo',
                });
              })
              .finally(() => {
                dispatch({
                  type: 'loading',
                  payload: { load: false, id: updatedTodo.id || 0 },
                });
                const timeout = setTimeout(() => {
                  dispatch({ type: 'setError', payload: null });
                  clearTimeout(timeout);
                }, 3000);
              });
          }
        }

        break;
      case 'Escape':
        setInputText(todo.title || '');
        setEditing(false);

        break;

      default:
        break;
    }
  };

  const handleToggleTodo = () => {
    dispatch({
      type: 'loading',
      payload: { load: true, id: todo.id || 0 },
    });
    updateTodo({ ...todo, completed: !todo.completed })
      .then(response => {
        dispatch({ type: 'toggleTodo', payload: response.id });
      })
      .catch(() => {
        dispatch({
          type: 'setError',
          payload: 'Unable to update a todo',
        });
      })
      .finally(() => {
        dispatch({
          type: 'loading',
          payload: { load: false, id: todo.id || 0 },
        });
        const timeout = setTimeout(() => {
          dispatch({ type: 'setError', payload: null });
          clearTimeout(timeout);
        }, 3000);
      });
  };

  useEffect(() => {
    if (editing && inputRefEdit.current) {
      inputRefEdit.current.focus();
    }
  }, [editing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed }, { editing })}
      onDoubleClick={() => setEditing(true)}
    >
      <label className="todo__status-label" htmlFor={`toggle-view-${todo.id}`}>
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          checked={todo.completed}
          id={`toggle-view-${todo.id}`}
          onChange={handleToggleTodo}
        />
      </label>

      {editing && (
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
          onBlur={() => handleKeyDown({ key: 'Enter' })}
        >
          <input
            ref={inputRefEdit}
            data-cy="TodoTitleField"
            type="text"
            value={inputText}
            className="todo__title-field edit "
            placeholder="Empty todo will be deleted"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setInputText(event.target.value)
            }
            onBlur={() => handleKeyDown({ key: 'Enter' })}
            onKeyUp={event => handleKeyDown(event)}
            disabled={todo.loading}
          />
        </form>
      )}

      {!editing && (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            hidden={editing}
            type="button"
            className="todo__remove "
            data-cy="TodoDelete"
            aria-label="Delete Todo"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': todo.loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
