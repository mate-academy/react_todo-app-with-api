import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (arg: Todo[]) => void;
  setErrorMessage: (arg: string) => void;
  loadingTodoId: number[];
  setLoadingTodoId: (arg: number[]) => void;
  onDeleteTodo: (arg: number) => void;
  onUpdateTodo: (arg: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, completed, title, userId },
  todos,
  setTodos,
  setErrorMessage,
  loadingTodoId,
  setLoadingTodoId,
  onDeleteTodo,
  onUpdateTodo,
}) => {
  const titleFocus = useRef<HTMLInputElement>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInputValue, setTitleInputValue] = useState('');

  const handleToggleTodo = () => {
    const updatedTodo = {
      id,
      completed: !completed,
      title,
      userId,
    };

    onUpdateTodo(updatedTodo);
  };

  const handleDeleteTodo = () => {
    onDeleteTodo(id);
  };

  const handleDoubleClick = () => {
    setEditingTitle(true);
    setTitleInputValue(title);
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setLoadingTodoId([id]);

    const preparedTitle = titleInputValue.trim();

    if (preparedTitle === title) {
      setEditingTitle(false);
    }

    if (preparedTitle.length === 0) {
      handleDeleteTodo();

      return;
    }

    const updatedTodo = { id, title: preparedTitle, completed, userId };

    updateTodo(updatedTodo)
      .then(todoElement => {
        const updatedTodos = todos.map(t =>
          t.id === todoElement.id ? updatedTodo : t,
        );

        setTodos(updatedTodos);
        setEditingTitle(false);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoId([]);
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    } else if (event.key === 'Escape') {
      setEditingTitle(false);
    }
  };

  const handleBlur = () => {
    const preparedTitle = titleInputValue.trim();

    if (preparedTitle === title.trim()) {
      setEditingTitle(false);

      return;
    }

    handleSubmit();
  };

  useEffect(() => {
    if (titleFocus.current) {
      titleFocus.current.focus();
    }
  }, [editingTitle]);

  useEffect(() => {
    if (editingTitle) {
      setTitleInputValue(title);
    }
  }, [editingTitle, title]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label" aria-label="toggle todo completion">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status')}
          checked={completed}
          onChange={handleToggleTodo}
        />
      </label>

      {editingTitle ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={titleFocus}
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={titleInputValue}
            onChange={e => {
              setTitleInputValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
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
        className={classNames('modal overlay', {
          'is-active': loadingTodoId.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
