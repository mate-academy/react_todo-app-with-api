/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import * as todosService from '../../api/todos';
import { useEffect, useRef, useState } from 'react';

type Props = {
  updateTodo: (value: Todo) => Promise<void>;
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  isChanging: boolean;
  isChangingSeveral: boolean;
  isSubmitting?: boolean;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setChangingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  allErrors: { [key: string]: string };
};

export const ToDo: React.FC<Props> = ({
  updateTodo,
  todo,
  deleteTodo,
  isChanging,
  isChangingSeveral,
  isSubmitting,
  setTodos,
  setChangingTodoId,
  setError,
  allErrors,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const todoEditingInput = useRef<HTMLInputElement>(null);

  function updateTitleTodo(todo: Todo) {
    const updatedTodo = {
      ...todo,
      title: editedTitle.trim(),
    };

    setChangingTodoId(updatedTodo.id);

    return todosService
      .updateTodo(updatedTodo)
      .then(() =>
        setTodos(tds => {
          return tds.map(todo =>
            todo.id === updatedTodo.id
              ? { ...todo, title: editedTitle.trim() }
              : todo,
          );
        }),
      )
      .catch(e => {
        setError(allErrors.updatingTodo);
        throw e;
      })
      .finally(() => {
        setChangingTodoId(null);
      });
  }

  function handleUpdateSubmit(event: React.FormEvent) {
    event.preventDefault();
    const normalizedEditedTitle = editedTitle.trim();

    if (!normalizedEditedTitle) {
      deleteTodo(todo.id);

      return;
    }

    if (normalizedEditedTitle === todo.title) {
      setIsEditing(false);
      setEditedTitle(todo.title.trim());

      return;
    }

    updateTitleTodo({
      id: todo.id,
      title: normalizedEditedTitle,
      completed: todo.completed,
      userId: todosService.USER_ID,
    }).then(() => {
      setEditedTitle(normalizedEditedTitle);
      setIsEditing(false);
    });
  }

  function handleBlur() {
    const normalizedEditedTitle = editedTitle.trim();

    if (!normalizedEditedTitle) {
      deleteTodo(todo.id);
      setIsEditing(false);

      return;
    }

    if (normalizedEditedTitle === todo.title) {
      setIsEditing(false);
      setEditedTitle(todo.title.trim());

      return;
    }

    updateTitleTodo({
      ...todo,
      title: normalizedEditedTitle,
    }).then(() => {
      setEditedTitle(normalizedEditedTitle);
      setIsEditing(false);
    });
  }

  useEffect(() => {
    if (isEditing) {
      todoEditingInput.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`${todo.id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          id={`${todo.id}`}
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdateSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-mainInput"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditedTitle(todo.title.trim());
                setIsEditing(false);
              }
            }}
            ref={todoEditingInput}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              todoEditingInput.current?.focus();
              setEditedTitle(todo.title);
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isChanging || isChangingSeveral || isSubmitting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
