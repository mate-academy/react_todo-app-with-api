import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo, Error } from '../types/Todo';
import * as todosService from '../api/todos';

type Props = {
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  todo: Todo,
  setHasError: (value: Error) => void,
  loadingIds: number[],
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>,
};

export const TodoItem: React.FC<Props> = ({
  todos,
  setTodos,
  todo,
  setHasError,
  loadingIds,
  setLoadingIds,
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isEdited]);

  const handleDeleteTodoById = () => {
    setLoadingIds((ids) => {
      return [...ids, todo.id];
    });
    todosService.deleteTodos(todo.id)
      .then(() => {
        if (setTodos && todos) {
          const newTodos: Todo[] = todos.filter(t => t.id !== todo.id);

          setTodos(newTodos);
        }
      })
      .catch(() => setHasError(Error.DELETE))
      .finally(() => {
        setLoadingIds((ids) => {
          return ids.filter(id => id !== todo.id);
        });
        setIsEdited(false);
      });
  };

  const changeStatus = (todoId: number, args: Partial<Todo>) => {
    setLoadingIds((ids) => {
      return [...ids, todo.id];
    });
    setHasError(Error.NOTHING);

    todosService.updateTodo(todoId, args)
      .then((updatedTodo) => setTodos(
        todos.map(currentTodo => {
          if (currentTodo.id === todoId) {
            return updatedTodo;
          }

          return currentTodo;
        }),
      ))
      .catch(() => {
        setHasError(Error.UPDATE);
      })
      .finally(() => {
        setLoadingIds((ids) => {
          return ids.filter(id => id !== todo.id);
        });
      });
  };

  const updateTitle = (event?: FormEvent<HTMLFormElement>): void => {
    if (event) {
      event.preventDefault();
    }

    if (todo.title === editedTitle) {
      setIsEdited(false);

      return;
    }

    if (editedTitle.length === 0) {
      handleDeleteTodoById();

      return;
    }

    setIsEdited(false);
    setHasError(Error.NOTHING);
    setLoadingIds((ids) => {
      return [...ids, todo.id];
    });

    todosService.updateTodo(todo.id, { title: editedTitle })
      .then((updatedTodo) => setTodos(
        todos.map(currentTodo => {
          if (currentTodo.id === todo.id) {
            return updatedTodo;
          }

          return currentTodo;
        }),
      ))
      .catch(() => {
        setHasError(Error.UPDATE);
      })
      .finally(() => {
        setLoadingIds((ids) => {
          return ids.filter(id => id !== todo.id);
        });
      });
  };

  const setEditMode = (value: boolean) => {
    setIsEdited(value);
  };

  const onEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setEditMode(false);
    }
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            changeStatus(todo.id, { completed: !todo.completed });
          }}
        />
      </label>

      {!isEdited ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditMode(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleteTodoById()}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={updateTitle}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            onBlur={() => {
              updateTitle();
              setEditMode(false);
            }}
            onKeyUp={onEscape}
            ref={titleField}
          />
        </form>
      )}

      <div className={cn('modal overlay', {
        'is-active': loadingIds.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
