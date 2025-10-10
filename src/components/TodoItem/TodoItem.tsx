/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import {
  deleteTodo,
  toggleTodo,
  updateTodo as updateTodoAPI,
} from '../../api/todos';

type Props = {
  isLoading?: boolean;
  deleteTodoFromArray?: (id: number) => void;
  updateTodo?: (newTodo: Todo) => void;
  throwErr?: (msg: string) => void;
  focusInput: () => void;
  todo: Todo;
};

type HandleTodoUPdateEvent =
  | React.FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement>;

const TodoItem: React.FC<Props> = ({
  isLoading,
  deleteTodoFromArray,
  updateTodo,
  throwErr,
  focusInput,
  todo,
}: Props) => {
  const { id, title, completed } = todo;
  const [isTodoLoading, setIsTodoLoading] = useState(isLoading);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  const handleTodoDeletion = () => {
    if (isTodoLoading) {
      return;
    }

    setIsTodoLoading(true);

    deleteTodo(id)
      .then(() => {
        if (deleteTodoFromArray) {
          deleteTodoFromArray(id);
        }
      })
      .catch(() => {
        if (throwErr) {
          throwErr('Unable to delete a todo');
        }
      })
      .finally(() => focusInput());
  };

  const handleToggleTodo = () => {
    if (isTodoLoading) {
      return;
    }

    setIsTodoLoading(true);

    toggleTodo(id, !completed)
      .then(newTodo => {
        if (updateTodo) {
          updateTodo(newTodo);
        }
      })
      .catch(() => {
        if (throwErr) {
          throwErr('Unable to update a todo');
        }
      })
      .finally(() => setIsTodoLoading(false));
  };

  const handleShowForm = () => {
    if (isTodoLoading) {
      return;
    }

    setIsFormVisible(true);
  };

  /* I can't write the content of HandleTodoUpdateEvent inside
  this function because the linter is complaining. */
  const handleTodoUpdate = (event: HandleTodoUPdateEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (isTodoLoading) {
      return;
    }

    const newTitle = titleField.current?.value;
    const newTodo = {
      title: newTitle?.trim(),
    };

    if (!newTodo.title) {
      handleTodoDeletion();
    } else if (newTodo.title !== title) {
      setIsTodoLoading(true);

      updateTodoAPI(id, newTodo)
        .then(updatedTodo => {
          if (updateTodo) {
            updateTodo(updatedTodo as Todo);
            setIsFormVisible(false);
          }
        })
        .catch(() => {
          if (throwErr) {
            throwErr('Unable to update a todo');
          }
        })
        .finally(() => {
          setIsTodoLoading(false);
        });
    } else {
      setIsFormVisible(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsFormVisible(false);
    }
  };

  useEffect(() => {
    if (isFormVisible) {
      titleField.current?.focus();
    }
  }, [isFormVisible]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      onDoubleClick={handleShowForm}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleToggleTodo}
          checked={completed}
        />
      </label>

      {isFormVisible ? (
        <form onSubmit={handleTodoUpdate}>
          <input
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            ref={titleField}
            defaultValue={title}
            onBlur={handleTodoUpdate}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleTodoDeletion}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTodoLoading || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
