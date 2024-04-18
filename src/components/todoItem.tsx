/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, updateTodo, updateTodoTitle } from '../api/todos';
import { useEffect, useRef } from 'react';

type Props = {
  todos: Todo[];
  todo: Todo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPreparedTodos: (e: Todo[] | ((f: any[]) => any[])) => void;
  isLoading: number[];
  setIsLoading: (e: (s: number[]) => number[] | number[]) => void;
  setErrorMessage: (m: string) => void;
  setIsEditing: (s: number | null) => void;
  isEditing: number | null;
  setUpdatedTitle: (t: string) => void;
  updatedTitle: string;
};

export const TodoItem: React.FC<Props> = ({
  todos,
  todo,
  setPreparedTodos,
  isLoading,
  setIsLoading,
  setErrorMessage,
  setIsEditing,
  isEditing,
  setUpdatedTitle,
  updatedTitle,
}) => {
  const updatedTitleField = useRef<HTMLInputElement>(null);

  const handleEsc = (event: { key: string }) => {
    if (event.key === 'Escape') {
      setIsEditing(null);
    }
  };

  useEffect(() => {
    if (updatedTitleField.current) {
      updatedTitleField.current.focus();
    }
  }, [isEditing]);

  const handleDeleteTodo = () => {
    setIsLoading(prevTodosIds => [...prevTodosIds, todo.id]);

    deleteTodo(todo.id)
      .then(() => {
        setPreparedTodos(
          todos.filter(currentTodo => currentTodo.id !== todo.id),
        );
      })
      .catch(() => {
        setErrorMessage(`Unable to delete a todo`);
      })
      .finally(() => setIsLoading(() => []));
  };

  const handleStatus = () => {
    setIsLoading(prevTodosIds => [...prevTodosIds, todo.id]);

    updateTodo(todo.id, !todo.completed)
      .then(updatedTodo => {
        setPreparedTodos(currentTodos => {
          const newTodos = [...currentTodos];

          const index = newTodos.findIndex(newTodo => todo.id === newTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setErrorMessage(`Unable to update a todo`);
      })
      .finally(() => setIsLoading(() => []));
  };

  const handleEdit = () => {
    window.addEventListener('keyup', handleEsc);
    setIsEditing(todo.id);
    setUpdatedTitle(todo.title);
  };

  const handleSubmitUpdating = (event: React.FormEvent) => {
    window.removeEventListener('keyup', handleEsc);

    event.preventDefault();

    setIsLoading(prevTodosIds => [...prevTodosIds, todo.id]);

    if (!updatedTitle.trim().length) {
      setIsEditing(null);
      handleDeleteTodo();
      setIsLoading(() => []);
    }

    if (updatedTitle === todo.title) {
      setIsEditing(null);
      setIsLoading(() => []);

      return;
    } else {
      updateTodoTitle(todo.id, updatedTitle)
        .then(updatedTodo => {
          setPreparedTodos(currentTodos => {
            const newTodos = [...currentTodos];

            const index = newTodos.findIndex(newTodo => todo.id === newTodo.id);

            newTodos.splice(index, 1, updatedTodo);

            return newTodos;
          });
        })
        .finally(() => {
          setIsEditing(null);
          setIsLoading(() => []);
        });
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label
        htmlFor={`status ${todo.id}`}
        className="todo__status-label"
        onClick={handleStatus}
      >
        <input
          id={`status ${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isEditing === todo.id ? (
        <form onSubmit={handleSubmitUpdating} onBlur={handleSubmitUpdating}>
          <input
            ref={updatedTitleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={event => {
              setUpdatedTitle(event.target.value);
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEdit}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
