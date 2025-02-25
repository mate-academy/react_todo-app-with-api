/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useRef, useState } from 'react';
import { TodoError, Todo } from '../../types/Todo';
import clsx from 'clsx';
import { updateTodo } from '../../api/todos';

type Props = {
  todoItem: Todo;
  removeTodo: (id: number) => void;
  complateTodo: (todo: Todo) => void;
  setLoadingTodoId?: (id: number[] | null) => void;
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
  showError?: (TodoError: TodoError) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todoItem,
  removeTodo,
  complateTodo,
  setLoadingTodoId = () => {},
  setTodos = () => {},
  showError = () => {},
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todoItem.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    setTitle(todoItem.title);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setTitle(todoItem.title);
    setIsEditing(false);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (title === todoItem.title) {
      setIsEditing(false);

      return;
    }

    if (!title.trim()) {
      removeTodo(todoItem.id);

      return;
    }

    setLoadingTodoId([todoItem.id]);
    setTodos(prevTodos =>
      prevTodos.map((item: Todo) =>
        item.id === todoItem.id ? { ...item, title } : item,
      ),
    );

    try {
      const response: Todo = await updateTodo({
        ...todoItem,
        title: title.trim(),
      });

      if (!response || !response.title) {
        showError(TodoError.UpdateError);

        return;
      }

      setTodos((prevTodos: Todo[]) =>
        prevTodos.map((item: Todo) =>
          item.id === response.id ? response : item,
        ),
      );
      setIsEditing(false);
    } catch {
      showError(TodoError.UpdateError);
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }

    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  return (
    <div
      data-cy="Todo"
      className={clsx('todo', { completed: todoItem.completed })}
    >
      <label className="todo__status-label" htmlFor={todoItem.id + 't'}>
        <input
          id={todoItem.id + 't'}
          data-cy="TodoStatus"
          type="checkbox"
          className={clsx('todo__status')}
          checked={todoItem.completed}
          onChange={() => complateTodo(todoItem)}
        />
      </label>
      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={startEditing}
        >
          {todoItem.title}
        </span>
      ) : (
        <form onSubmit={handleSubmit} className="todo__form">
          <input
            data-cy="TodoTitleField"
            type="text"
            ref={inputRef}
            className="todo__title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      )}
      {!isEditing && (
        <button
          type="button"
          className={clsx('todo__remove')}
          data-cy="TodoDelete"
          onClick={() => removeTodo(todoItem.id)}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={clsx('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
