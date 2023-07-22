import classNames from 'classnames';
import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import { removeTodo, updateTodo } from '../../api/todos';
import { Error, Todo, TodoForServer } from '../../types/todo';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setHasError: (value: Error) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  todos,
  setHasError,
  isLoading,
  setIsLoading,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdited]);

  const handleClickEsc = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEdited(false);
    }
  };

  const updateTodoHandler = (todoId: number, data: TodoForServer) => {
    updateTodo(todoId, data)
      .then(() => {
        const newTodos = todos.map(t => {
          if (t.id === todoId) {
            return {
              ...t,
              ...data,
            };
          }

          return t;
        });

        setTodos(newTodos);
      })
      .catch(() => {
        setHasError(Error.Update);
      })
      .finally(() => {
        setIsLoading(false);
        setIsEdited(false);
      });
  };

  const removeTodoHandler = (todoId: number) => {
    setIsLoading(true);

    removeTodo(todoId)
      .then(() => {
        const newTodos = todos.filter(t => t.id !== todoId);

        setTodos(newTodos);
      })
      .catch(() => {
        setHasError(Error.Delete);
      })
      .finally(() => {
        setIsLoading(false);
        setIsEdited(false);
      });
  };

  const toggleComplete = (todoId: number) => {
    setIsLoading(true);
    updateTodoHandler(todoId, { completed: !todo.completed });
  };

  const changeTodoTitle = () => {
    if (todo.title === editedTitle) {
      setIsEdited(false);

      return;
    }

    /* eslint-disable-next-line */
    editedTitle.trim() === ''
      ? removeTodoHandler(todo.id)
      : updateTodoHandler(todo.id, { title: editedTitle });
  };

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    changeTodoTitle();
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={() => setIsEdited(true)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
        />
      </label>

      {!isEdited ? (
        <>
          <span className="todo__title">{todo.title}</span>

          {isHovered && (
            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTodoHandler(todo.id)}
            >
              ×
            </button>
          )}
        </>
      ) : (
        <form onSubmit={onSubmitHandler}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={changeTodoTitle}
            onKeyUp={handleClickEsc}
          />
        </form>
      )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
