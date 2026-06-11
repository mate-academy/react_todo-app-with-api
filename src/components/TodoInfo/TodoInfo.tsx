import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo, updateTodo } from '../../api/todos';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
  loadingTodoIds: number[];
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMessage,
  loadingTodoIds,
}) => {
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  function handleDeleteTodo() {
    setIsTodoLoading(true);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.filter(prevTodo => prevTodo.id !== todo.id),
        );

        setIsTodoLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsTodoLoading(false);
      });
  }

  function saveTitle() {
    if (!isEditing) {
      return;
    }

    const trimmedTitle = tempTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (trimmedTitle === '') {
      handleDeleteTodo();

      return;
    }

    setIsEditing(false);
    setIsTodoLoading(true);

    updateTodo({ ...todo, title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(prevTodo =>
            prevTodo.id === todo.id ? updatedTodo : prevTodo,
          ),
        );
        setIsEditing(false);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTempTitle(todo.title);
        setIsEditing(true);
      })
      .finally(() => setIsTodoLoading(false));
  }

  function handleToggleStatus() {
    setIsTodoLoading(true);

    const updatedTodo = { ...todo, completed: !todo.completed };

    updateTodo(updatedTodo)
      .then(newTodo => {
        setTodos((prevTodos: Todo[]) => {
          return prevTodos.map((prevTodo: Todo) => {
            return prevTodo.id === newTodo.id ? newTodo : prevTodo;
          });
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setIsTodoLoading(false);
      });
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      setTempTitle(todo.title);
      setIsEditing(false);
    }
  }

  function handleSubmitEditing(event: React.FormEvent) {
    event.preventDefault();
    saveTitle();
  }

  function handleBlurEvent() {
    if (isEditing) {
      saveTitle();
    }
  }

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleToggleStatus}
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmitEditing}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={tempTitle}
            onChange={e => setTempTitle(e.target.value)}
            onBlur={handleBlurEvent}
            onKeyUp={handleKeyDown}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            data-cy="TodoDelete"
            type="button"
            className="todo__remove"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isTodoLoading || loadingTodoIds.includes(todo.id),
        })}
      >
        <div
          data-cy="TodoLoader"
          className={classNames('modal-background has-background-white-ter', {
            'is-active': isTodoLoading || loadingTodoIds.includes(todo.id),
          })}
        />
        <div className="loader" />
      </div>
    </li>
  );
};
