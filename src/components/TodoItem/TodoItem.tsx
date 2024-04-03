import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodosContext } from '../../helpers/useTodoContext';
import { useEffect, useRef, useState } from 'react';
import { updateTodos } from '../../api/todos';
import { getErrors } from '../../helpers/getErorrs';
import { Errors } from '../../enums/Errors';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { id, title, completed } = todo;
  const {
    onDelete,
    loadingTodoIds,
    setErrorMessage,
    setLoadingTodoIds,
    setTodos,
    handleCompletedAllTodos,
  } = useTodosContext();
  const [isEdit, setIsEdit] = useState(false);
  const [changeTitle, setChangeTitle] = useState(title);

  const changeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && changeInput.current) {
      changeInput.current.focus();
    }
  }, [isEdit]);

  const updateTodo = () => {
    setErrorMessage(null);
    setLoadingTodoIds(prev => [...prev, id]);

    if (!changeTitle.trim().length) {
      return onDelete(id);
    }

    if (changeTitle === title) {
      setIsEdit(false);
      setLoadingTodoIds([]);

      return;
    }

    return updateTodos(id, { title: changeTitle.trim() })
      .then(updatedTodoItem => {
        setTodos(currentTodos => {
          const updatedTodos = currentTodos.map(currentTodo => {
            if (currentTodo.id === updatedTodoItem.id) {
              return updatedTodoItem;
            }

            return currentTodo;
          });

          setIsEdit(false);

          return updatedTodos;
        });
      })
      .catch(() => {
        setIsEdit(true);
        getErrors(Errors.UpdateTodo, setErrorMessage);
      })
      .finally(() => {
        setLoadingTodoIds([]);
      });
  };

  const handleCompletion = () => {
    handleCompletedAllTodos(id, !completed)
      .then(() => {
        setTodos(todos => {
          return todos.map(prevTodo => {
            return prevTodo.id === id
              ? { ...prevTodo, completed: !prevTodo.completed }
              : prevTodo;
          });
        });
      })
      .catch(() => {
        getErrors(Errors.UpdateTodo, setErrorMessage);
      })
      .finally(() => {
        setLoadingTodoIds([]);
      });
  };

  const handleEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setChangeTitle(title);
      setIsEdit(false);
      setLoadingTodoIds([]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateTodo();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          aria-label="Todo status"
          onClick={() => handleCompletion()}
        />
      </label>

      {isEdit ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={changeInput}
            onBlur={updateTodo}
            onKeyUp={handleEsc}
            value={changeTitle}
            onChange={event => setChangeTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdit(!isEdit)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
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
