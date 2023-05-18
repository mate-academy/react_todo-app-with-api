import React, { useState, useEffect, useRef } from 'react';
import CN from 'classnames';
import { deleteTodo, patchTodo } from '../../api/todos';
import { Todo, Update } from '../../types/Todo';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  todoIdsInUpdating: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setError,
  todoIdsInUpdating,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(todo.title);

  const isCurrentTodoInUpdating = todoIdsInUpdating.includes(todo.id);

  const handleDelete = () => {
    setIsDeleting(true);

    deleteTodo(todo.id)
      .then(() => {
        return setTodos((prevTodos: Todo[]) => {
          return prevTodos.filter((curTodo) => curTodo.id !== todo.id);
        });
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const handleEdit = (enteredInfo: Update) => {
    setIsLoading(true);

    patchTodo(todo.id, enteredInfo)
      .then((updatedTodo: Todo) => {
        setTodos((prevTodos) => {
          const prevTodosCopy = [...prevTodos];

          const indexOfUpdatedTodo = prevTodosCopy.findIndex(
            (currentTodo) => currentTodo.id === updatedTodo.id,
          );

          prevTodosCopy[indexOfUpdatedTodo] = updatedTodo;

          return prevTodosCopy;
        });
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTitleEdit = () => {
    setIsEditing(false);

    if (inputValue === todo.title) {
      return;
    }

    if (inputValue) {
      handleEdit({ title: inputValue });
    } else {
      handleDelete();
    }
  };

  // eslint-disable-next-line
  const handleEditingFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    handleTitleEdit();
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const escapeHandlePress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setInputValue(todo.title);
        setIsEditing(false);
      }
    };

    document.addEventListener('keyup', escapeHandlePress);

    return () => {
      document.removeEventListener('keyup', escapeHandlePress);
    };
  }, [todo]);

  return (
    <div className={CN('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={(event) => {
            handleEdit({ completed: event.target.checked });
          }}
          ref={inputRef}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditingFormSubmit}>
          <input
            type="text"
            className="todo__title-field"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onBlur={handleTitleEdit}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div className={CN('modal', 'overlay', {
        'is-active': isCurrentTodoInUpdating || isDeleting || isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
