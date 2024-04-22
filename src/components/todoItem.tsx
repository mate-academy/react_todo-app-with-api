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
  todosInProcess: number[];
  setTodosInProcess: (e: (s: number[]) => number[] | number[]) => void;
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
  todosInProcess,
  setTodosInProcess,
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
    setTodosInProcess(prevTodosIds => [...prevTodosIds, todo.id]);

    deleteTodo(todo.id)
      .then(() => {
        setPreparedTodos(
          todos.filter(currentTodo => currentTodo.id !== todo.id),
        );
      })
      .catch(() => {
        setErrorMessage(`Unable to delete a todo`);
      })
      .finally(() => setTodosInProcess(() => []));
  };

  const handleStatus = () => {
    setTodosInProcess(prevTodosIds => [...prevTodosIds, todo.id]);

    updateTodo(todo.id, !todo.completed)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((updatedTodo: any) => {
        const updatedTodoStatus = updatedTodo.completed;

        setPreparedTodos(currentTodos => {
          currentTodos
            .filter(currentTodo => todo.id === currentTodo.id)
            .map(todoForUpdating => {
              const newTodo = todoForUpdating;

              newTodo.completed = updatedTodoStatus;
            });

          return currentTodos;
        });
      })
      .catch(() => {
        setErrorMessage(`Unable to update a todo`);
      })
      .finally(() => setTodosInProcess(() => []));
  };

  const handleEdit = () => {
    window.addEventListener('keyup', handleEsc);
    setIsEditing(todo.id);
    setUpdatedTitle(todo.title);
  };

  const handleSubmitUpdating = (event: React.FormEvent) => {
    window.removeEventListener('keyup', handleEsc);

    event.preventDefault();

    setTodosInProcess(prevTodosIds => [...prevTodosIds, todo.id]);

    if (!updatedTitle.trim().length) {
      setIsEditing(null);
      handleDeleteTodo();
      setTodosInProcess(() => []);
    }

    if (updatedTitle === todo.title) {
      setIsEditing(null);
      setTodosInProcess(() => []);

      return;
    } else {
      updateTodoTitle(todo.id, updatedTitle)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((updatedTodo: any) => {
          const updatedTodoTitle = updatedTodo.title;

          setPreparedTodos(currentTodos => {
            currentTodos
              .filter(currentTodo => todo.id === currentTodo.id)
              .map(todoForUpdating => {
                const newTodo = todoForUpdating;

                newTodo.title = updatedTodoTitle;
              });

            return currentTodos;
          });
        })
        .finally(() => {
          setIsEditing(null);
          setTodosInProcess(() => []);
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
          'is-active': todosInProcess.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
