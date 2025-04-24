import classNames from 'classnames';
import React, { useCallback, useRef, useState } from 'react';
import { TodoItemTypes } from './todo-item';
import { updateTodo } from '../../api/todos';
import { text } from '../../constants/text';
import { deleteTodoWithUI } from '../../utils/deleteTodo';

export const TodoItemComponent: React.FC<TodoItemTypes> = ({
  todo,
  deleteTodoHandler,
  loadingId,
  handleChange,
  setTodos,
  setCustomError,
  handleLoaderId,
  titleField,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [value, setValue] = useState<string>(todo.title);
  const { completed, title } = todo;

  const field = useRef<HTMLInputElement>(null);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onDoubleClick = () => {
    setValue(todo.title);
    setIsVisible(!isVisible);
    setTimeout(() => {
      if (field.current) {
        field.current.focus();
      }
    }, 0);
  };

  const onSubmitForm = useCallback(
    (event: React.FormEvent<HTMLFormElement | HTMLInputElement>) => {
      event.preventDefault();
      setCustomError('');
      handleLoaderId(todo);
      const newTodo = { ...todo, title: value?.trim() ?? '' };

      if (newTodo.title === todo.title) {
        handleLoaderId(todo);
        setIsVisible(!isVisible);

        return;
      }

      if (newTodo.title === '') {
        deleteTodoWithUI({
          todo,
          setTodos,
          setCustomError,
          handleLoaderId,
          titleField,
        });

        return;
      }

      updateTodo(todo.id, newTodo)
        .then(todoFromServer => {
          setTodos(prevState => {
            const newState = [...prevState];

            const startIndex = prevState.findIndex(
              index => index.id === todoFromServer.id,
            );

            newState.splice(startIndex, 1, newTodo);

            return newState;
          });

          handleLoaderId(todo);
          setIsVisible(!isVisible);
        })
        .catch(err => {
          setCustomError(text.unableToUpdateTodo);
          setTimeout(() => {
            if (field.current) {
              field.current.focus();
            }
          }, 0);
          handleLoaderId(todo);

          throw err;
        });
    },
    [
      handleLoaderId,
      isVisible,
      setCustomError,
      setTodos,
      titleField,
      todo,
      value,
    ],
  );

  const onKayDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsVisible(!isVisible);
    }
  };

  return (
    <div
      onDoubleClick={onDoubleClick}
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          onChange={() => handleChange(todo)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>
      {isVisible && (
        <form onSubmit={onSubmitForm}>
          <input
            onBlur={onSubmitForm}
            onKeyDown={onKayDown}
            ref={field}
            onChange={handleChangeInput}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
          />
        </form>
      )}

      {!isVisible && (
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
      )}

      {!isVisible && (
        <button
          onClick={() => deleteTodoHandler(todo)}
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingId[todo.id],
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
