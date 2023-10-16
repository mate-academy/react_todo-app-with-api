/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';

import classNames from 'classnames';

import './TodoItem.scss';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext';
import { removeTodo, updateTodo } from '../../api/todos';

type Props = {
  item: Todo,
};

export const TodoItem: React.FC<Props> = ({ item }) => {
  const {
    dispatch,
    tempTodo,
    setErrorMessage,
    clearAllIds,
    toggledIds,
  } = useContext(TodosContext);
  const editRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTodoTitle, setEditedTodoTitle] = useState(item.title);
  const [isLoading, setIsLoading] = useState(false);

  const isLoaderActive = (
    tempTodo?.id === item.id
      || isLoading
      || clearAllIds.includes(item.id)
      || toggledIds.includes(item.id)
  );

  useEffect(() => {
    if (isEditing) {
      editRef.current?.focus();
    }
  }, [isEditing]);

  const handleCompletedChange = () => {
    setIsLoading(true);

    updateTodo(item.id, { completed: !item.completed })
      .then(() => dispatch({
        type: 'toggle',
        payload: {
          ...item,
          completed: !item.completed,
        },
      }))
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setIsLoading(false));
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleRemoveItem = () => {
    setIsLoading(true);

    removeTodo(item.id)
      .then(() => dispatch({
        type: 'remove',
        payload: item.id,
      }))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => setIsLoading(false));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTodoTitle(event.target.value);
  };

  const saveTitleChange = () => {
    if (editedTodoTitle === item.title) {
      setIsEditing(false);

      return;
    }

    const trimmedTitle = editedTodoTitle.trim();

    if (trimmedTitle.length !== 0) {
      setIsLoading(true);
      const oldTodoTitle = item.title;

      dispatch({
        type: 'edit',
        payload: {
          ...item,
          title: trimmedTitle,
        },
      });

      updateTodo(item.id, { title: trimmedTitle })
        .then(() => setIsEditing(false))
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          dispatch({
            type: 'edit',
            payload: {
              ...item,
              title: oldTodoTitle,
            },
          });
        })
        .finally(() => setIsLoading(false));
    } else {
      handleRemoveItem();
    }
  };

  const handleTitleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoTitle(item.title);
      setIsEditing(false);
    }

    if (event.key === 'Enter') {
      saveTitleChange();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: item.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={item.completed}
          onChange={handleCompletedChange}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {item.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemoveItem}
          >
            ×
          </button>
        </>
      ) : (
        <input
          data-cy="TodoTitleField"
          ref={editRef}
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editedTodoTitle}
          onChange={handleTitleChange}
          onKeyUp={handleTitleKeyUp}
          onBlur={saveTitleChange}
        />
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
