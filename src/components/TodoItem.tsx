/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { useContext, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { DispatchContext, StateContext } from './MainContext';
import { deleteTodo, updateTodo } from '../api/todos';
import { ActionTypes } from '../types/ActionTypes';
import { TodoLoader } from './TodoLoader';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useContext(DispatchContext);
  const { loadingIdTodos } = useContext(StateContext);
  const [isLoader, setIsLoader] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { id, title, completed } = todo;

  const isIncludesId = loadingIdTodos.includes(id);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDeleteTodo = (idNumber: number) => {
    setIsLoader(true);

    deleteTodo(idNumber)
      .then(() => {
        dispatch({
          type: ActionTypes.DeleteTodo,
          payload: id,
        });

        setIsLoader(false);
      })
      .catch(() => {
        dispatch({
          type: ActionTypes.SetValuesByKeys,
          payload: {
            errorMessage: 'Unable to delete a todo',
          },
        });

        setIsLoader(false);
      });
  };

  const handleToggleTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoader(true);

    updateTodo(id, { ...todo, completed: e.target.checked })
      .then(item => {
        dispatch({
          type: ActionTypes.ToggleTodo,
          payload: item,
        });

        setIsLoader(false);
      })
      .catch(() => {
        dispatch({
          type: ActionTypes.SetValuesByKeys,
          payload: {
            errorMessage: 'Unable to add a todo',
          },
        });

        setIsLoader(false);
      });
  };

  const handleonBlur = () => {
    if (editingValue !== todo.title) {
      setIsLoader(true);

      updateTodo(id, { ...todo, title: editingValue })
        .then(item => {
          dispatch({
            type: ActionTypes.ToggleTodo,
            payload: item,
          });
        })
        .catch(() => {
          dispatch({
            type: ActionTypes.SetValuesByKeys,
            payload: {
              errorMessage: 'Unable to add a todo',
            },
          });
        })
        .finally(() => {
          setIsLoader(false);
          setIsEditing(false);
        });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleonBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditingValue(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={e => handleToggleTodo(e)}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={inputRef}
            value={editingValue}
            onChange={e => setEditingValue(e.target.value)}
            onBlur={handleonBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(id)}
        >
          ×
        </button>
      )}

      <TodoLoader isLoader={isLoader} id={id} isIncludesId={isIncludesId} />
    </div>
  );
};
