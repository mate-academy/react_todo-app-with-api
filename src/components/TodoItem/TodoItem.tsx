import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Error';
import { USER_ID, deleteTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  id: number;
  title: string;
  completed: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<Error>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isInputLoading?: boolean;
  deletingTodoIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  setErrorMessage,
  setTodos,
  isInputLoading = false,
  deletingTodoIds,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodoTitle, setEditedTodoTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setIsCompleted(completed);
    setEditedTodoTitle(title);
  }, [completed, title]);

  const handleDeleteTodo = (todoId: number) => {
    setIsLoading(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Error.unableToDelete);
        setTimeout(() => {
          setErrorMessage(Error.none);
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleToggleTodo = (updatedTodo: Todo) => {
    setIsLoading(true);
    updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(item => item.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
        setIsCompleted(!isCompleted);
      })
      .catch(() => {
        setErrorMessage(Error.unableToUpdate);
        setTimeout(() => {
          setErrorMessage(Error.none);
        }, 3000);
      })
      .finally(() => setIsLoading(false));
  };

  const handleEditTodo = (updatedTodo: Todo) => {
    setIsLoading(true);
    if (editedTodoTitle.trim() === title) {
      setIsEditing(false);
      setIsLoading(false);

      return;
    }

    if (!editedTodoTitle.trim()) {
      handleDeleteTodo(id);

      return;
    }

    updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(item => item.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          setIsEditing(false);

          return newTodos;
        });
      })
      .catch(() => {
        inputRef.current?.focus();
        setErrorMessage(Error.unableToUpdate);
        setTimeout(() => {
          setErrorMessage(Error.none);
        }, 3000);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        {' '}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() =>
            handleToggleTodo({
              id: id,
              title: title,
              completed: !isCompleted,
              userId: USER_ID,
            })
          }
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            onClick={() => handleDeleteTodo(id)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleEditTodo({
              id: id,
              title: editedTodoTitle.trim(),
              completed: isCompleted,
              userId: USER_ID,
            });
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTodoTitle}
            onChange={e => setEditedTodoTitle(e.target.value)}
            onKeyUp={e => {
              e.preventDefault();
              if (e.key === 'Escape') {
                setEditedTodoTitle(title);
                setIsEditing(false);
              }
            }}
            onBlur={e => {
              e.preventDefault();
              handleEditTodo({
                id: id,
                title: editedTodoTitle.trim(),
                completed: isCompleted,
                userId: USER_ID,
              });
            }}
            ref={inputRef}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active':
            isLoading || isInputLoading || deletingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
