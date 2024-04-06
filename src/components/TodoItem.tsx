import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useTodosContext } from '../context/useTodosContext';
import { updateTodo } from '../api/todos';
import { Error } from '../types/Error';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setTodos,
    handleError,
    loadingTodosIds,
    setLoadingTodosIds,
    removeTodo,
    toggleTodo,
  } = useTodosContext();
  const [editing, setEditing] = useState(false); //
  const [title, setTitle] = useState(todo.title); //
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editing]);

  const renameTodo = (todoToRename: Todo, newTitle: string) => {
    handleError('');
    setLoadingTodosIds(currentIds => [...currentIds, todoToRename.id]);

    return updateTodo({
      ...todoToRename,
      title: newTitle,
    })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(error => {
        handleError(Error.updateTodo);
        throw error;
      })
      .finally(() => {
        setLoadingTodosIds(currentIds =>
          currentIds.filter(id => id !== todoToRename.id),
        );
      });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (normalizedTitle === todo.title) {
      setEditing(false);

      return;
    }

    if (!normalizedTitle) {
      removeTodo(todo.id);

      return;
    }

    try {
      await renameTodo(todo, normalizedTitle);

      setEditing(false);
    } catch (error) {
      editInputRef.current?.focus();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditing(false);
      setTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label" aria-label="todo__status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editInputRef}
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodosIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
