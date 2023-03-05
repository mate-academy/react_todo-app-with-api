import classNames from 'classnames';

import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

import { onUpdate } from '../../api/todos';

type Props = {
  todo: Todo,
  withLoader?: boolean,
  onRemoveTodo: (id: number) => void,
  onCompletedChange: (value: Todo) => void,
  loadTodos: () => void,
  setErrorMessage:(value: string) => void,
};

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    withLoader,
    onRemoveTodo,
    onCompletedChange,
    loadTodos,
    setErrorMessage,
  }) => {
    const { id, completed, title } = todo;

    const [hasLoader, setHasLoader] = useState(withLoader);
    const [isDoubleClick, setIsDoubleClick] = useState(false);

    const [editedTitle, setEditedTitle] = useState(title);

    const handleDelete = () => {
      onRemoveTodo(id);
      setHasLoader(true);
    };

    const handleClick = async () => {
      setHasLoader(true);

      await onCompletedChange(todo);
      setHasLoader(false);
    };

    const onEditTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setEditedTitle(value);
    };

    const onSaveChanges = async (currentTodo: Todo) => {
      setHasLoader(true);
      setIsDoubleClick(false);

      if (!editedTitle.length) {
        handleDelete();
      }

      try {
        await onUpdate(currentTodo.id, {
          id: currentTodo.id,
          userId: currentTodo.userId,
          title: editedTitle,
          completed,
        });
      } catch (error) {
        setErrorMessage('Unable to update a todo');
      }

      setHasLoader(false);
      loadTodos();
    };

    const onKeyPress = async (
      currentTodo: Todo,
      event: React.KeyboardEvent,
    ) => {
      if (event.key === 'Enter') {
        onSaveChanges(currentTodo);
      }
    };

    return (
      <div
        key={id}
        className={classNames(
          'todo',
          { completed },
        )}
      >
        <label
          className="todo__status-label"
        >

          <input
            type="checkbox"
            className="todo__status"
            onClick={handleClick}
          />
        </label>

        {!isDoubleClick ? (
          <span
            className="todo__title"
            onDoubleClick={() => setIsDoubleClick(true)}
          >
            {title}
          </span>
        ) : (
          <input
            type="text"
            className="todo__title"
            value={editedTitle}
            onChange={onEditTodo}
            onKeyUp={(event) => onKeyPress(todo, event)}
            onBlur={() => onSaveChanges(todo)}
          />
        )}

        <button
          type="button"
          className="todo__remove"
          onClick={handleDelete}
        >
          ×
        </button>

        {hasLoader && (
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    );
  },
);
