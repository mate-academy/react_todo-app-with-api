/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext, TodosUpdateContext } from '../../contexts/TodosProvider';
import { EditTodoForm } from '../EditTodoForm';

interface Props {
  todo: Todo,
  isLoading?: boolean
}

export const TodoItem: React.FC<Props> = ({ todo, isLoading = false }) => {
  const {
    deleteTodo,
    updateTodo,
    setEditingTodoId,
  } = useContext(TodosUpdateContext);
  const { operatingTodoIds, editingTodoId } = useContext(TodosContext);
  const { title, completed, id } = todo;
  const todoTitleSpan = useRef<HTMLSpanElement | null>(null);

  const handleTodoChanged = (newTitle: string) => {
    const normalizedTitle = newTitle.trim();

    if (normalizedTitle !== title) {
      if (normalizedTitle === '') {
        deleteTodo(id)
          .then(() => {
            setEditingTodoId(0);
          });
      } else {
        updateTodo(id, { title: normalizedTitle })
          .then(() => {
            setEditingTodoId(0);
          });
      }
    } else {
      setEditingTodoId(0);
    }
  };

  const handleTodoChangeCancelled = () => {
    setEditingTodoId(0);
  };

  const handleTodoStatusChanged = () => {
    updateTodo(id, { completed: !completed });
  };

  const handleDblclick = () => {
    if (!editingTodoId) {
      setEditingTodoId(todo.id);
    }
  };

  const handleDeleteButtonClicked = () => {
    deleteTodo(id);
  };

  useEffect(() => {
    todoTitleSpan.current?.addEventListener('dblclick', handleDblclick);

    return () => (
      // eslint-disable-next-line react-hooks/exhaustive-deps
      todoTitleSpan.current?.removeEventListener('dblclick', handleDblclick)
    );
  });

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          checked={completed}
          onChange={handleTodoStatusChanged}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {editingTodoId === todo.id
        ? (
          <EditTodoForm
            onCanceled={handleTodoChangeCancelled}
            onTodoChanged={handleTodoChanged}
            initialTitle={title}
          />
        )
        : (
          <>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <span
              ref={todoTitleSpan}
              data-cy="TodoTitle"
              className="todo__title"
            >
              {todo.title}
            </span>
            <button
              onClick={handleDeleteButtonClicked}
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading
            || operatingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
