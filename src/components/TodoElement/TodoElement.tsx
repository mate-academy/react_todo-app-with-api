import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Todo } from '../../types/Todo';
import { completeTodo, removeTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMassage';

interface Props {
  todo: Todo,
  setError: React.Dispatch<React.SetStateAction<ErrorMessage>>;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean,
  isDeleting: boolean,
}

export const TodoElement: FC<Props> = ({
  todo,
  setHidden,
  setError,
  isLoading,
  isDeleting,
}) => {
  const {
    title, completed, id, userId,
  } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const deleteTodoMutation = useMutation(['todoRemove'], removeTodo, {
    onSuccess: () => queryClient.invalidateQueries(['todos', userId]),
    onError: () => {
      setError(ErrorMessage.Delete);
      setHidden(false);
    },
  });

  const updateTodoMutation = useMutation(
    ['todoCheck', id],
    completeTodo,
    {
      onSuccess: () => queryClient.invalidateQueries(['todos', userId]),
      onError: () => {
        setError(ErrorMessage.Update);
        setHidden(false);
      },
    },
  );

  const handleChecked = () => {
    if (todo) {
      const modifiedTodo: Todo = {
        ...todo,
        completed: !todo.completed,
      };

      updateTodoMutation.mutate({
        id: modifiedTodo.id,
        todo: modifiedTodo,
      }, {
        onSuccess: () => {
          return queryClient.invalidateQueries(['todos', userId]);
        },
      });
    }
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    deleteTodoMutation.mutate(Number(event.currentTarget.value));
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    setIsEditing(true);
  };

  const handleEditBlur = () => {
    if (editInputRef.current) {
      if (editInputRef.current.value && editInputRef.current.value !== title) {
        updateTodoMutation.mutate({
          id: todo.id,
          todo: {
            ...todo,
            title: editInputRef.current.value,
          },
        });
      }

      if (!editInputRef.current.value) {
        deleteTodoMutation.mutate(id);
      }
    }

    setIsEditing(false);
  };

  const handleEditConfirm = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (editInputRef.current) {
      editInputRef.current.focus();
      if (event.key === 'Enter') {
        if (editInputRef.current.value
          && editInputRef.current.value !== title) {
          updateTodoMutation.mutate({
            id: todo.id,
            todo: {
              ...todo,
              title: editInputRef.current.value,
            },
          });
        }

        if (!editInputRef.current.value) {
          deleteTodoMutation.mutate(id);
        }

        setIsEditing(false);
      }

      if (event.key === 'Escape') {
        setIsEditing(false);
      }
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          value={id}
          onClick={handleChecked}
        />
      </label>

      {!isEditing && (
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
            value={id}
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleDelete}
          >
            ×
          </button>
        </>

      )}

      {isEditing && (
        <form>
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={title}
            onKeyDown={handleEditConfirm}
            onBlur={handleEditBlur}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': id === 0
              || isDeleting
              || isLoading
              || updateTodoMutation.isLoading
              || deleteTodoMutation.isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
