import cn from 'classnames';

import { Todo } from '../../types/Todo';
import React, { useEffect, useState, useRef } from 'react';
import { patchTodo } from '../../api/todos';
import { deleteTodos } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todo: Todo;
  onDeleteTodo: (id: number) => void;
  todoIdsInLoading: number[];
  onUpdateTodo: (updatedTodo: Todo) => void;
  onSetTodoIdsInLoading: React.Dispatch<React.SetStateAction<number[]>>;
  onSetTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
  onHandleErrorShow: (_: string) => void;
  todoEditingId: number | null;
  onSetTodoEditingId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onUpdateTodo,
  todoIdsInLoading,
  onHandleErrorShow,
  onSetTodoIdsInLoading,
  onSetTodo,
  todoEditingId,
  onSetTodoEditingId,
}) => {
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isHasError, setIsHasError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTitleEditing, isHasError]);

  useEffect(() => {
    setIsTitleEditing(isHasError);
  }, [isHasError]);

  const handleChange = () => {
    onUpdateTodo(todo);
  };

  const handleUpdateTodoTitle = async (updatedTodo: Todo) => {
    onSetTodoIdsInLoading((prev: number[]) => [...prev, updatedTodo.id]);

    if (!updatedTodo.title) {
      deleteTodos(updatedTodo.id)
        .then(() => {
          onSetTodo(prevTodo =>
            prevTodo.filter((curTodo: Todo) => curTodo.id !== updatedTodo.id),
          );
          setIsHasError(false);
          onSetTodoEditingId(null);
        })
        .catch(() => {
          onHandleErrorShow(ErrorMessage.DeletingError);
          setIsHasError(true);
        })
        .finally(() => {
          onSetTodoIdsInLoading(prev =>
            prev.filter(curTodoId => curTodoId !== todo.id),
          );
        });

      return;
    }

    onSetTodo(prevTodos =>
      prevTodos.map(item => {
        if (item.id === updatedTodo.id) {
          return updatedTodo;
        }

        return item;
      }),
    );

    patchTodo(updatedTodo.id, updatedTodo)
      .then(() => {
        setIsHasError(false);
        onSetTodoEditingId(null);
      })
      .catch(() => {
        onHandleErrorShow(ErrorMessage.UpdatingError);
        setIsHasError(true);
      })
      .finally(() => {
        onSetTodoIdsInLoading(prev =>
          prev.filter(curTodoId => curTodoId !== updatedTodo.id),
        );
      });
  };

  const handleOnSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    onSetTodoEditingId(todo.id);
    setEditedTitle(prev => prev.trim());

    await handleUpdateTodoTitle({
      ...todo,
      title: editedTitle.trim(),
    });

    if (!isHasError) {
      setIsTitleEditing(false);
    }
  };

  const handleOnBlur = () => {
    if (todoEditingId) {
      setEditedTitle(prev => prev.trim());

      handleUpdateTodoTitle({
        ...todo,
        title: editedTitle.trim(),
      });

      if (!isHasError) {
        setIsTitleEditing(false);
      }
    }
  };

  const handleDoubleClick = () => {
    setIsTitleEditing(true);
    onSetTodoEditingId(todo.id);
  };

  const isOnLoading = !todo.id || todoIdsInLoading.includes(todo.id);
  const isEditing = !isTitleEditing || todoEditingId !== todo.id;

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed }, 'item-enter-done')}
    >
      <label className="todo__status-label">
        <input
          aria-label="todo__status"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChange}
        />
      </label>

      {isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      ) : (
        <form onSubmit={handleOnSubmit} onBlur={handleOnBlur}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => {
              setEditedTitle(event.target.value);
            }}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsTitleEditing(false);
                setEditedTitle(todo.title);
              }
            }}
          />
        </form>
      )}
      {!isTitleEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            onDeleteTodo(todo.id);
          }}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isOnLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
