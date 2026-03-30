import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/TodoContext';
import { Todo } from '../types/Todo';

export const TodoList: React.FC = () => {
  const context = useContext(TodoContext);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  if (!context) {
    return null;
  }

  const {
    filteredTodo,
    handleSelected,
    handleRemove,
    handleUpdateTodo,
    processingTodoIds,
    tempTodo,
  } = context;

  const startEditing = (currentTodo: Todo) => {
    setEditingTodoId(currentTodo.id);
    setEditedTitle(currentTodo.title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditedTitle('');
  };

  const isProcessing = (id: number) => {
    return processingTodoIds.includes(id);
  };

  const submitEditing = async (currentTodo: Todo) => {
    if (isProcessing(currentTodo.id)) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === currentTodo.title) {
      cancelEditing();

      return;
    }

    if (!trimmedTitle) {
      const wasDeleted = await handleRemove(currentTodo.id);

      if (wasDeleted) {
        cancelEditing();
      }

      return;
    }

    const wasUpdated = await handleUpdateTodo(currentTodo.id, {
      title: trimmedTitle,
    });

    if (wasUpdated) {
      cancelEditing();
    }
  };

  const renderTodo = (
    currentTodo: (typeof filteredTodo)[number],
    isTempTodo = false,
  ) => {
    const isEditing = editingTodoId === currentTodo.id;

    return (
      <div
        key={
          currentTodo.id === 0 ? `temp-${currentTodo.title}` : currentTodo.id
        }
        data-cy="Todo"
        className={classNames('todo', {
          completed: currentTodo.completed,
        })}
      >
        <label
          className="todo__status-label"
          htmlFor={`todo-${currentTodo.id}`}
        >
          <input
            id={`todo-${currentTodo.id}`}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={currentTodo.completed}
            aria-label="Mark todo as completed"
            onChange={() => handleSelected(currentTodo.id)}
          />
        </label>

        {isEditing ? (
          <form
            onSubmit={event => {
              event.preventDefault();
              submitEditing(currentTodo);
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitle}
              autoFocus
              onChange={event => setEditedTitle(event.target.value)}
              onBlur={() => submitEditing(currentTodo)}
              onKeyUp={event => {
                if (event.key === 'Escape') {
                  cancelEditing();
                }
              }}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => startEditing(currentTodo)}
            >
              {currentTodo.title}
            </span>

            <button
              onClick={() => handleRemove(currentTodo.id)}
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              disabled={isTempTodo}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isTempTodo || isProcessing(currentTodo.id),
          })}
        >
          <div className="loader" />
        </div>
      </div>
    );
  };

  return (
    <>
      {filteredTodo
        .filter(currentTodo => currentTodo.title.length > 0)
        .map(currentTodo => renderTodo(currentTodo))}
      {tempTodo && renderTodo(tempTodo, true)}
    </>
  );
};
