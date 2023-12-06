import classNames from 'classnames';
import React, { useContext, useRef, useState } from 'react';

import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    id, title, completed,
  } = todo;

  const {
    isSubmiting,
    deleteTodo,
    updateTodo,
  } = useContext(TodosContext);

  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const titleField = useRef<HTMLInputElement>(null);

  const handleTodoDelete = (todoId : number) => {
    deleteTodo(todoId);
  };

  const handleToggleTodo = () => {
    updateTodo({ ...todo, completed: !completed });
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = editTitle.trim();

    switch (trimmedTitle) {
      case '':
        handleTodoDelete(id);
        break;

      case title:
        setEditTitle(title);
        break;

      default:
        updateTodo({ ...todo, title: trimmedTitle });
        break;
    }

    setIsEdit(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEdit(false);
      setEditTitle(title);
    }
  };

  const handleDoubleClick = () => {
    setIsEdit(true);

    setTimeout(() => {
      titleField.current?.focus();
    }, 1);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed }, { editing: isEdit })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggleTodo}
        />
      </label>

      {isEdit ? (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={titleField}
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onBlur={handleEditSubmit}
            onKeyUp={handleKeyUp}

          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          { 'is-active': isSubmiting && !todo.id })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
