import React, { useContext, useState, useMemo } from 'react';
import classNames from 'classnames';
import { useNotification } from '../contexts/NotificationContext';
import { TodosContext } from '../contexts/TodoContext';
import { EditContext } from '../contexts/EditContext';
import { TodoEdit } from '../ui/TodoEdit';
import { ErrorType, Todo } from '../model/types';
import { useFocus } from '../contexts/FocusContext';

type Props = {
  todo: Todo;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, isLoading }) => {
  const { id, title } = todo;
  const { showNotification, hideNotification } = useNotification();

  const {
    state,
    handleDeleteTodo,
    handleToggleTodo,
    deletingTodoIds,
    processingIds,
  } = useContext(TodosContext);

  const { editedTodoId, setEditedTodoId } = useContext(EditContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const { focusInput } = useFocus();

  const isBeingDeleted = deletingTodoIds?.includes(id);
  const isProcessing = processingIds?.includes(id);

  const isCompleted = useMemo(() => {
    const fromState = state.todos.find(t => t.id === id)?.completed;

    return fromState ?? todo.completed;
  }, [state.todos, id, todo.completed]);

  const handleToggle = () => {
    hideNotification();

    const current =
      state.todos.find(t => t.id === todo.id)?.completed ?? todo.completed;

    void handleToggleTodo(todo.id, current);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const ok = await handleDeleteTodo(id);

    if (!ok) {
      showNotification(ErrorType.DELETE_TODO);
    } else {
      hideNotification();
      focusInput();
    }

    setIsDeleting(false);
  };

  const completedTodoClass = classNames('todo', { completed: isCompleted });

  const modalLoaderClass = () =>
    classNames('modal overlay', {
      'is-active': isLoading || isDeleting || isBeingDeleted || isProcessing,
    });

  return (
    <div data-cy="Todo" className={completedTodoClass}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`completed-${id}`}>
        <input
          id={`completed-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={handleToggle}
        />
      </label>

      {editedTodoId === id ? (
        <TodoEdit title={title} id={id} />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditedTodoId(id)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div data-cy="TodoLoader" className={modalLoaderClass()}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
