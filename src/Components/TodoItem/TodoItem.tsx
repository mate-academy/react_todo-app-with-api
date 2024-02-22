import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../Types/Todo';
import { TodosContext } from '../Store/Store';
import { client } from '../../utils/fetchClient';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = React.memo(({ todo }) => {
  const {
    errorMessage,
    setTodos,
    isProcessing,
    setErrorMessage,
    addProcessing,
    removeProcessing,
    focus,
  } = useContext(TodosContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const todoField = useRef<HTMLInputElement>(null);

  const handleEditTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleUpdateTodo = useCallback(
    (updatedTodo: Todo) => {
      setTodos(current =>
        current.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
      );
    },
    [setTodos],
  );

  const handleDeleteTodo = async () => {
    setErrorMessage('');
    addProcessing(todo.id);

    try {
      await client.delete(`/${todo.id}`);

      setTodos(current => current.filter(t => t.id !== todo.id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      removeProcessing(todo.id);
      focus.current?.focus();
    }
  };

  const handleCheckbox = async () => {
    addProcessing(todo.id);
    setErrorMessage('');

    try {
      const updatedTodo = { ...todo, completed: !todo.completed };

      await client.patch(`/${todo.id}`, { completed: !todo.completed });

      handleUpdateTodo(updatedTodo);
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      removeProcessing(todo.id);
    }
  };

  const applyEditing = async () => {
    if (editTitle.trim().length === 0) {
      handleDeleteTodo();

      return;
    }

    if (editTitle.trim() !== todo.title && editTitle.length !== 0) {
      addProcessing(todo.id);

      try {
        const updatedTodo = { ...todo, title: editTitle.trim() };

        await client.patch(`/${todo.id}`, { title: editTitle.trim() });
        handleUpdateTodo(updatedTodo);
      } catch {
        setErrorMessage('Unable to update a todo');
        removeProcessing(todo.id);

        return;
      } finally {
        removeProcessing(todo.id);
      }
    }

    setIsEditing(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyEditing();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing || (isEditing && errorMessage)) {
      todoField.current?.focus();
    }
  }, [isEditing, errorMessage]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckbox}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            ref={todoField}
            value={editTitle}
            onChange={handleEditTitle}
            onBlur={applyEditing}
            onKeyUp={handleKeyUp}
            placeholder="Empty todo will be deleted"
            disabled={isProcessing.includes(todo.id)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDeleteTodo}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessing.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
