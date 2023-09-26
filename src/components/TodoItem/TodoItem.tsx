import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import { useTodos } from '../../TodosContext';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    tempTodos,
    handleUpdateTodo,
    handleDeleteTodo,
    handlerTitleFieldFocused,
  } = useTodos();

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const trimmedNewTitle = newTitle.trim();

  const todoElementRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      todoElementRef.current?.focus();
    }
  }, [isEditing]);

  const handleCheckboxChange = () => {
    handleUpdateTodo({ ...todo, completed: !todo.completed });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewTitle(todo.title);
  };

  const handleSaveEdit = async () => {
    handlerTitleFieldFocused(false);
    if (trimmedNewTitle === '') {
      await handleDeleteTodo(todo);
    } else if (trimmedNewTitle !== todo.title) {
      const response: boolean = await handleUpdateTodo({
        ...todo,
        title: trimmedNewTitle,
      });

      if (response) {
        // console.log(response);
        handlerTitleFieldFocused(true);
        setNewTitle(trimmedNewTitle);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    handleSaveEdit();
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    } else if (e.key === 'Enter') {
      handleSaveEdit();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckboxChange}
        />
      </label>

      {isEditing
        ? (
          <input
            type="text"
            ref={todoElementRef}
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        )
        : (
          <>
            <span
              className="todo__title"
              data-cy="TodoTitle"
              onDoubleClick={handleDoubleClick}
            >
              {tempTodos[0]?.id === todo.id ? tempTodos[0].title : todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(todo)}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames('modal overlay', {
          'is-active': tempTodos.some(item => item.id === todo.id),
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
