import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/Error';
import { deleteOnServer, updateOnServer } from '../api/todos';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: (value: ErrorType) => void;
  isUpdating: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  setError,
  isUpdating,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState<string>(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  function deleteTodo(todoId: number) {
    const updatedTodos = todos.filter((td) => td.id !== todoId);

    setIsLoading(true);
    deleteOnServer(todoId)
      .catch(() => setError(ErrorType.Delete))
      .finally(() => {
        setIsLoading(false);
        setTodos(updatedTodos);
      });
  }

  function toggleComplete(id: number) {
    const updatedTodo = {
      ...todos.find((td) => td.id === id),
      completed: !todo.completed,
    } as Todo;

    setIsLoading(true);
    updateOnServer(updatedTodo)
      .catch(() => setError(ErrorType.Update))
      .finally(() => setIsLoading(false));

    const updatedTodos = todos.map((td) => {
      if (td.id === id) {
        return {
          ...td,
          completed: !td.completed,
        };
      }

      return td;
    });

    setTodos(updatedTodos);
  }

  function updateTodoTitle() {
    if (todo.title === updatedTitle) {
      setIsEditing(false);

      return;
    }

    if (updatedTitle === '') {
      deleteTodo(todo.id);

      return;
    }

    const updatedTodo = { ...todo, title: updatedTitle };

    setIsLoading(true);
    updateOnServer(updatedTodo)
      .then(() => {
        setTodos((updatedTodos: Todo[]) => {
          const newTodos = [...updatedTodos];
          const index = newTodos.findIndex((td) => td.id === updatedTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(() => setError(ErrorType.Update))
      .finally(() => {
        setIsLoading(false);
        setIsEditing(false);
      });
  }

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateTodoTitle();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setUpdatedTitle(todo.title);
    }
  };

  return (
    <>
      <div
        className={cn('todo', {
          completed: todo.completed,
        })}
        onDoubleClick={() => setIsEditing(true)}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => toggleComplete(todo.id)}
          />
        </label>
        {isEditing ? (
          <form onSubmit={onSubmitHandler}>
            <input
              ref={inputRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              onBlur={updateTodoTitle}
              onKeyUp={handleKeyUp}
            />
          </form>
        ) : (
          <span className="todo__title">
            {todo.title}
          </span>
        )}

        <button
          type="button"
          className="todo__remove"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>

        <div
          className={cn('modal overlay', {
            'is-active': isLoading || isUpdating,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
