import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { deleteTodo } from '../api/todos';
import { useEffect, useRef } from 'react';

type Props = {
  todo: Todo;
  isTempTodo?: boolean;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  processingIds: number[];
  focusInput: () => void | undefined;
  handleToggle: (todo: Todo) => Promise<void>;
  editingTodoId: number | null;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setProcessingIds,
  setTodos,
  setErrorMessage,
  processingIds,
  focusInput,
  isTempTodo,
  handleToggle,
  editingTodoId,
  setEditingTodoId,
  editingTitle,
  setEditingTitle,
}) => {
  const handleClick = async () => {
    setProcessingIds(prev => [...prev, todo.id]);

    try {
      await deleteTodo(todo.id);
      setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
      if (editingTodoId === todo.id) {
        setEditingTodoId(null);
        setEditingTitle('');
      }
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todo.id));
      focusInput();
    }
  };

  const handleOnBlur = async () => {
    if (editingTitle.trim() !== todo.title && editingTitle.trim().length > 0) {
      handleToggle(todo);
    } else if (editingTitle.trim().length === 0) {
      handleClick();
    } else if (editingTitle.trim() === todo.title) {
      setEditingTitle('');
      setEditingTodoId(null);
      focusInput();
    }
  };

  const hasKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && editingTitle.trim() === todo.title) {
      setEditingTitle('');
      setEditingTodoId(null);
      focusInput();

      return;
    }

    if (event.key === 'Enter' && editingTitle.trim().length > 0) {
      handleToggle(todo);

      return;
    } else if (event.key === 'Enter' && editingTitle.trim().length === 0) {
      handleClick();

      return;
    } else if (event.key === 'Escape') {
      setEditingTodoId(null);
      setEditingTitle('');

      return;
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todo.id === editingTodoId && inputRef.current) {
      const input = inputRef.current;

      input.focus();
    }
  }, [editingTodoId, todo.id]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        active: !todo.completed,
      })}
      key={todo.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            handleToggle(todo);
            focusInput();
          }}
        />
      </label>

      {todo.id !== editingTodoId ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditingTodoId(todo.id);
              setEditingTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleClick}
          >
            ×
          </button>
        </>
      ) : (
        <input
          ref={inputRef}
          type="text"
          className="todo__title-field"
          data-cy="TodoTitleField"
          value={editingTitle}
          onChange={event => {
            setEditingTitle(event.target.value);
          }}
          onKeyDown={hasKeyDown}
          onBlur={handleOnBlur}
        />
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processingIds.includes(todo.id) || isTempTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
