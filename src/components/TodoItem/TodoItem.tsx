import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, isLoading }) => {
  const {
    deleteTodo,
    toggleTodo,
    updateTodo,
  } = React.useContext(TodosContext);

  const { completed, title, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const inputField = React.useRef<HTMLInputElement>(null);
  // useRef означает, что мы можем получить доступ к DOM-узлу,
  // который мы передали в качестве аргумента (ссылка на текстовое поле ввода)

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [isEditing]);
  // если isEditing равно true. Если isEditing 
  // становится false, то фокус не будет устанавливаться.

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(title);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle('');
    // setEditTitle('') - не изменяет значение editTitle,
    // если не были внесены изменения в текстовое поле ввода
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTitle = editTitle.trim();

    if (newTitle === title) {
      handleEditCancel();

      return;
    }

    if (newTitle) {
      updateTodo({
        ...todo,
        title: newTitle,
      })
        .then(() => {
          handleEditCancel();
        })
        .catch(() => {});
    } else {
      deleteTodo(id);
    }
  };

  const handleKeyUp = (key: React.KeyboardEvent<HTMLInputElement>) => {
    if (key.code === 'Escape') {
      handleEditCancel();
    }
  };


    return (
    <div
      data-cy="Todo"
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => !isLoading && toggleTodo(todo)}
        />
      </label>
      
      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle" 
            className="todo__title"
            onDoubleClick={handleDoubleClick}
            >
            { title }
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ): (
        <form onSubmit={handleEditSubmit} onBlur={handleEditCancel}>
          <input
            data-cy="TodoTitleField"
            ref={inputField}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': todo.id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
