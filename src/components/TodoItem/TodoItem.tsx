/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useContext, useRef, useState } from 'react';
import { DispatchContext } from '../../store/Store';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useContext(DispatchContext);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [value, setValue] = useState(todo.title);
  const [isEdit, setIsEdit] = useState(false);
  const inputElem = useRef<HTMLInputElement>(null);

  const handleDeleteTodo = () => {
    setIsDeleting(true);
    deleteTodo(todo.id)
      .then(() => {
        dispatch({ type: 'DELETE_TODO', payload: { id: todo.id } });
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to delete a todo' },
        });
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const handleDoubleClick = () => {
    setIsEdit(true);
    setTimeout(() => {
      if (inputElem.current) {
        inputElem.current.focus();
      }
    }, 10);
  };

  const handlerBlur = () => {
    if (!value.length) {
      handleDeleteTodo();
    }

    if (todo.title === value) {
      setIsEdit(false);

      return;
    }

    setIsEdit(false);
    setIsDeleting(true);
    updateTodo({ ...todo, title: value })
      .then(() => {
        setIsDeleting(false);
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to update a todo' },
        });
      });
  };

  const updateChecked = (updatedTodo: Todo) => {
    setIsDeleting(true);
    updateTodo({ ...todo, completed: !updatedTodo.completed, title: value })
      .then(() => {
        dispatch({ type: 'TOGGLE_TODO', payload: { id: todo.id } });
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to update a todo' },
        });
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlerBlur();
  };

  const handleButtonChange = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setValue(todo.title);
    }
  };

  return (
    <>
      {isEdit ? (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              checked={todo.completed}
              className="todo__status"
            />
          </label>

          {/* This form is shown instead of the title and remove button */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputElem}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={value}
              onKeyUp={handleButtonChange}
              onBlur={handlerBlur}
              onChange={e => setValue(e.target.value)}
            />
          </form>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ) : (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => updateChecked(todo)}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {value}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', {
              'is-active': isDeleting || todo.id === 0,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
