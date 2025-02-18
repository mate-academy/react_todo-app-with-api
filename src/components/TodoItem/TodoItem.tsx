import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import * as todoService from '../../api/todos';
import { useEffect, useRef, useState } from 'react';
import * as todoUtils from '../../utils/todoUtils';
import { TodoHelpers } from '../../types/TodoHelpers';

type TodoItemProps = {
  todo: Todo;
  loadingTodoId: number | number[] | null;
  helpers: TodoHelpers;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loadingTodoId,
  helpers,
}) => {
  const [updatedTitle, setUpdatedTitle] = useState<string>('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const { id, title, completed } = todo;

  const editTodoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editTodoRef.current !== null) {
      editTodoRef.current.focus();
    }
  }, [editingTodoId]);

  const checkModalActive = (currentTodo: Todo): string => {
    if (loadingTodoId === currentTodo.id) {
      return 'modal overlay is-active';
    }

    if (
      loadingTodoId !== null &&
      Array.isArray(loadingTodoId) &&
      loadingTodoId.includes(currentTodo.id)
    ) {
      return 'modal overlay is-active';
    }

    return 'modal overlay';
  };

  const startEditTodo = (currentTodo: Todo) => {
    setEditingTodoId(currentTodo.id);
    setUpdatedTitle(currentTodo.title);
  };

  const { setErrorMessage, setLoadingTodoId, setTodos, closeError, timerId } =
    helpers;

  const changeTitleTodo = (selectedTodo: Todo) => {
    setErrorMessage('');
    setLoadingTodoId(selectedTodo.id);

    if (updatedTitle.trim() === selectedTodo.title.trim()) {
      setLoadingTodoId(null);
      setEditingTodoId(null);

      return;
    }

    if (updatedTitle.trim() === '') {
      setLoadingTodoId(selectedTodo.id);
      todoUtils.deleteTodo(selectedTodo.id, helpers);
    } else {
      todoService
        .updateTodo({
          ...selectedTodo,
          title: updatedTitle.trim(),
        })
        .then(updatedTodo => {
          setTodos(currentTodos => {
            return currentTodos.map(currentTodo =>
              currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
            );
          });
          setErrorMessage('');
          setEditingTodoId(null);
          setLoadingTodoId(null);
        })
        .catch(error => {
          setEditingTodoId(selectedTodo.id);
          setErrorMessage('Unable to update a todo');
          window.clearTimeout(timerId.current);
          closeError();
          throw error;
        })
        .finally(() => setLoadingTodoId(null));
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            todoUtils.updateTodo({ ...todo, completed: !completed }, helpers);
          }}
        />
      </label>

      {editingTodoId === id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            changeTitleTodo(todo);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={event => setUpdatedTitle(event.target.value)}
            onBlur={() => {
              changeTitleTodo(todo);
            }}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                setEditingTodoId(null);
              }
            }}
            ref={editTodoRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              startEditTodo(todo);
            }}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              todoUtils.deleteTodo(id, helpers);
            }}
          >
            ×
          </button>
        </>
      )}

      <div data-cy="TodoLoader" className={checkModalActive(todo)}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
