/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useContext, useRef, useState } from 'react';
import { DispatchContext } from '../../store/Store';
import { deleteTodo, updateTodo } from '../../api/todos';
import { RenamingForm } from '../RenamingForm/RenamingForm';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;

  const dispatch = useContext(DispatchContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [value, setValue] = useState(title);

  const [isEdit, setIsEdit] = useState(false);

  const inputElem = useRef<HTMLInputElement>(null);

  const handleDeleteTodo = () => {
    setIsLoading(true);
    deleteTodo(id)
      .then(() => {
        dispatch({ type: 'DELETE_TODO', payload: { id } });
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to delete a todo' },
        });
      })
      .finally(() => {
        setIsLoading(false);
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

    if (title === value.trim()) {
      setIsEdit(false);

      return;
    }

    setValue(text => text.trim());
    setIsLoading(true);

    updateTodo({ ...todo, title: value })
      .then(() => {
        setIsEdit(false);
      })
      .catch(() => {
        setIsEdit(true);
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to update a todo' },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateChecked = (updatedTodo: Todo) => {
    setIsLoading(true);
    updateTodo({ ...todo, completed: !updatedTodo.completed, title: value })
      .then(() => {
        dispatch({ type: 'TOGGLE_TODO', payload: { id } });
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to update a todo' },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlerBlur();
  };

  const handleButtonChange = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setValue(title);
      setIsEdit(false);
    }
  };

  return (
    <>
      {isEdit ? (
        <RenamingForm
          handleButtonChange={handleButtonChange}
          handleSubmit={handleSubmit}
          handlerBlur={handlerBlur}
          isLoading={isLoading}
          todo={todo}
          value={value}
          setValue={setValue}
          inputElem={inputElem}
        />
      ) : (
        <div data-cy="Todo" className={classNames('todo', { completed })}>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
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
              'is-active': isLoading || id === 0,
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
