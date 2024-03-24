/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable jsx-a11y/label-has-associated-control
import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './Todos-Context';
import { USER_ID, updateTodo } from '../api/todos';
// eslint-disable-next-line no-redeclare

interface PropsItem {
  todo: Todo;
}
export const TodoItem: React.FC<PropsItem> = ({ todo }) => {
  const [isInput, setIsInput] = useState<boolean>(false);
  const [rewrite, setRewrite] = useState('');
  const inputTwo = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line max-len, prettier/prettier
  const {
    handleCompleted,
    todoDeleteButton,
    deletingTodos,
    setTodos,
    setDeletingTodos,
    setErrorMessage,
  } = useContext(TodosContext);
  const { title, completed, id } = todo;

  const handleDoobleClickInput = () => {
    setIsInput(prev => !prev);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setRewrite(event.target.value);
  };

  const handlerInput = () => {
    if (rewrite.trim() !== '' && rewrite.trim() !== title) {
      setDeletingTodos(prevTodos => [...prevTodos, id]);
      updateTodo({ id, title: rewrite.trim(), completed })
        .then(todo1 => {
          setTodos(prevTodos =>
            prevTodos.map(t => {
              if (t.id === id) {
                return todo1;
              }

              return t;
            }),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          setIsInput(true);
        })
        .finally(() => {
          setDeletingTodos(prevTodos => prevTodos.filter(t => t !== id));
        });

      return;
    }

    todoDeleteButton(USER_ID, id);
  };

  const pushKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handlerInput();
      setIsInput(false);
    } else if (event.key === 'Escape') {
      setIsInput(false);
    }
  };

  useEffect(() => {
    if (isInput && inputTwo?.current) {
      inputTwo.current.focus();
    }
  }, [isInput]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
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
      {!isInput && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoobleClickInput}
        >
          {title}
        </span>
      )}
      {!isInput && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => todoDeleteButton(USER_ID, id)}
        >
          ×
        </button>
      )}

      {isInput && (
        <form onSubmit={e => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={title}
            onChange={handleChange}
            onDoubleClick={handleDoobleClickInput}
            onKeyUp={pushKey}
            onBlur={handlerInput}
            ref={inputTwo}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletingTodos.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
