import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodosContext } from '../../hooks/useTodosContext';
import { deleteTodo, updateTodo } from '../../api/todos';
import { Errors } from '../../enums/Errors';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    loadingTodoIds,
    setLoadingTodoIds,
    setTodos,
    showError,
    setIsFocusedInput,
  } = useTodosContext();

  const [editTodoId, setEditTodoId] = useState(0);
  const [tempTitle, setTempTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const { id, title, completed } = todo;

  useEffect(() => {
    if (editTodoId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editTodoId]);

  const handleDelete = async (todoId: number): Promise<void> => {
    setLoadingTodoIds([todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId));
      setIsFocusedInput(true);
    } catch {
      showError(Errors.DeleteTodo);
      if (editTodoId !== todoId) {
        setIsFocusedInput(true);
      }

      throw new Error(Errors.DeleteTodo);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const toggleCompleted = (todoId: number, status: boolean) => {
    setLoadingTodoIds([todoId]);

    updateTodo(todoId, { completed: !status })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(t =>
            t.id === todoId ? { ...t, completed: !status } : t,
          ),
        );
      })
      .catch(() => {
        showError(Errors.UpdateTodo);
      })
      .finally(() => setLoadingTodoIds([]));
  };

  const handleFormOpen = (todoId: number, todoTitle: string) => {
    setEditTodoId(todoId);
    setTempTitle(todoTitle);
  };

  const saveChanges = (normalizedTitle: string) => {
    setLoadingTodoIds([editTodoId]);

    if (!normalizedTitle.length) {
      handleDelete(editTodoId).then(() => setEditTodoId(0));
    } else {
      updateTodo(editTodoId, { title: normalizedTitle })
        .then(() => {
          setEditTodoId(0);
          setTodos(prevTodos =>
            prevTodos.map(t =>
              t.id === editTodoId ? { ...t, title: normalizedTitle } : t,
            ),
          );
        })
        .catch(() => {
          showError(Errors.UpdateTodo);
        })
        .finally(() => setLoadingTodoIds([]));
    }
  };

  const handleRename = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedTitle = tempTitle.trim();

    if (title === normalizedTitle) {
      setEditTodoId(0);
    } else {
      saveChanges(normalizedTitle);
    }
  };

  const cancelEditing = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditTodoId(0);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label" aria-label="todo__status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleCompleted(id, completed)}
        />
      </label>

      {editTodoId === id ? (
        <form onSubmit={handleRename}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editInputRef}
            value={tempTitle}
            onBlur={() => saveChanges(tempTitle.trim())}
            onKeyUp={cancelEditing}
            onChange={event => setTempTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleFormOpen(id, title)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
