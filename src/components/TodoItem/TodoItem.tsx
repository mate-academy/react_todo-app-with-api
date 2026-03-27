import classNames from 'classnames';
import { useContext, useState, useRef, useEffect } from 'react';
import { deleteTodo, patchTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../store/TodoContext';
import { ErrorContext } from '../../store/ErrorContext';
import { LoadingContext } from '../../store/LoadingContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos } = useContext(TodoContext);
  const { loadingIds, setLoadingIds } = useContext(LoadingContext);
  const { showError } = useContext(ErrorContext);

  const [title, setTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const deleteTodoFromServer = async (skipLoading = false) => {
    if (!skipLoading) {
      setLoadingIds(prev => [...prev, todo.id]);
    }

    try {
      const response = await deleteTodo(todo.id);

      if (response === 0) {
        throw new Error('Invalid response from server');
      }

      setTodos(prev => prev.filter(t => t.id !== todo.id));
    } catch (err) {
      showError('Unable to delete a todo');
    } finally {
      if (!skipLoading) {
        setLoadingIds(prev => prev.filter(i => i !== todo.id));
      }
    }
  };

  const todoCompleteButton = async () => {
    setLoadingIds(prev => [...prev, todo.id]);
    try {
      await patchTodo(todo.id, { completed: !todo.completed });

      setTodos(prev =>
        prev.map(item =>
          item.id === todo.id ? { ...item, completed: !item.completed } : item,
        ),
      );
    } catch (err) {
      showError('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(i => i !== todo.id));
    }
  };

  const cancelEditings = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitle(todo.title);
      setIsEditing(false);
    }
  };

  const editTodo = async () => {
    const trimmed = title.trim();

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    setLoadingIds(prev => [...prev, todo.id]);
    try {
      if (trimmed.length === 0) {
        inputRef.current?.focus();
        await deleteTodoFromServer(true);

        return;
      }

      await patchTodo(todo.id, { title: trimmed });

      setTodos(prev =>
        prev.map(item =>
          item.id === todo.id ? { ...item, title: trimmed } : item,
        ),
      );

      setIsEditing(false);
    } catch (err) {
      showError('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const sendEditedTodo = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    editTodo();
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={todoCompleteButton}
        />
      </label>
      {isEditing ? (
        <form onSubmit={sendEditedTodo}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onKeyUp={event => cancelEditings(event)}
            onBlur={() => editTodo()}
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
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodoFromServer(false)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === 0 || loadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
