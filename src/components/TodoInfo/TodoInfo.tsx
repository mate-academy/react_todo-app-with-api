import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, toggleTodo, updateTodo } from '../../api/todos';

type Props = {
  setError: (error: string) => void,
  setVisibleTodos: (value: ((prevState: Todo[]) => Todo[])) => void,
  todo: Todo,
  isDeletingAll: boolean,
  isTogglingAll: boolean,
};

export const TodoInfo: React.FC<Props> = ({
  setError,
  setVisibleTodos,
  todo,
  isDeletingAll,
  isTogglingAll,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputTitleEditing, setIinputTitleEditing] = useState(todo.title);

  const onDeleteTodo = async () => {
    setIsDeleting(true);
    try {
      await deleteTodo(todo.id);
      setVisibleTodos(prev => (
        prev.filter(item => item.id !== todo.id)
      ));
    } catch (e) {
      setError('delete');
    }

    setIsDeleting(false);
  };

  const onToggle = async () => {
    setIsDeleting(true);

    try {
      await toggleTodo(todo);
      setVisibleTodos(prev => (
        prev.map((item) => {
          if (item.id === todo.id) {
            return {
              ...item,
              completed: !item.completed,
            };
          }

          return item;
        })
      ));
    } catch (e) {
      setError('update');
    }

    setIsDeleting(false);
  };

  const onFormSubmit = async () => {
    if (inputTitleEditing === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!inputTitleEditing.trim()) {
      onDeleteTodo();

      return;
    }

    setIsDeleting(true);

    try {
      await updateTodo(todo, inputTitleEditing);

      setVisibleTodos(prev => (
        prev.map((item) => {
          if (item.id === todo.id) {
            return {
              ...item,
              title: inputTitleEditing,
            };
          }

          return item;
        })
      ));
    } catch (e) {
      setError('update');
    }

    setIsEditing(false);
    setIsDeleting(false);
  };

  const {
    id, title, completed,
  } = todo;

  return (
    <div
      key={id}
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
          defaultChecked={completed}
          onClick={onToggle}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onFormSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={(input) => input?.focus()}
            value={inputTitleEditing}
            onChange={(e) => setIinputTitleEditing(e.target.value)}
            onBlur={() => onFormSubmit()}
            onKeyUp={(e) => {
              if (e.key === 'Escape') {
                setIsEditing(false);
                setIinputTitleEditing(title);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={onDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isDeleting
            || (isDeletingAll && completed)
            || (isTogglingAll && !completed),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
