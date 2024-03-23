/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable jsx-a11y/label-has-associated-control
import React, { useContext, useState } from 'react';
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
  // eslint-disable-next-line max-len, prettier/prettier
  const {
    loading,
    handleCompleted,
    todoDeleteButton,
    deletingTodos,
    todos,
    setTodos,
    setDeletingTodos,
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
    if (rewrite.trim() !== '') {
      const upTodos = todos.map(item => {
        if (item.id === todo.id) {
          return { ...item, title: rewrite };
        }

        return item;
      });

      setTodos(upTodos);
    } else {
      const upTodos = todos.filter(item => item.id !== todo.id);

      setTodos(upTodos);
    }

    updateTodo({ id, title: rewrite, completed });
    setDeletingTodos([id]);
    setIsInput(false);

    if (rewrite.length === 0) {
      todoDeleteButton(USER_ID, id);
    }

    updateTodo({ id, title: rewrite, completed }).finally(() => {
      setDeletingTodos(prev => prev.filter(item => item !== id));
    });
  };

  const pushKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handlerInput();
      setIsInput(false);
    } else if (event.key === 'Escape') {
      setIsInput(false);
    }
  };

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

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => todoDeleteButton(USER_ID, id)}
      >
        ×
      </button>
      {isInput && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={title}
            onChange={handleChange}
            onDoubleClick={handleDoobleClickInput}
            onKeyDown={pushKey}
            onBlur={handlerInput}
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
