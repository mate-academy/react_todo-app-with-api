import classNames from 'classnames';
import { useContext, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { TodosContext } from '../../contexts/TodoContext';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { title, completed, id } = todo;

  const {
    setTodos,
    setErrorMessage,
    editedTodos,
    setEditedTodos,
    errorMessage,
  } = useContext(TodosContext);

  const [editedTitle, setEditedTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isEditing, errorMessage]);

  const clickHandler = () => {
    setEditedTodos(currentTodos => [...currentTodos, todo]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== id),
        );
      })
      .catch(() => setErrorMessage(Errors.onDelete))
      .finally(() => setEditedTodos([]));
  };

  const inputChangesHandler = () => {
    setEditedTodos(currentTodos => [...currentTodos, todo]);

    updateTodo({ completed: !completed, title, id })
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === id
              ? { ...currentTodo, completed: !completed }
              : currentTodo,
          ),
        ),
      )
      .catch(() => setErrorMessage(Errors.onUpdate))
      .finally(() => setEditedTodos([]));
  };

  const onSubmitChanges = (event: React.FormEvent) => {
    event.preventDefault();

    if (!editedTitle.trim()) {
      setEditedTodos(currentTodos => [...currentTodos, todo]);

      deleteTodo(id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currentTodo => currentTodo.id !== id),
          );
        })
        .catch(() => setErrorMessage(Errors.onDelete))
        .finally(() => setEditedTodos([]));
    }

    if (editedTitle.trim()) {
      if (editedTitle === title) {
        setIsEditing(false);
      } else {
        setEditedTodos(currentTodos => [...currentTodos, todo]);

        updateTodo({ completed, id, title: editedTitle })
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.map(currentTodo =>
                currentTodo.id === id
                  ? { ...currentTodo, title: editedTitle.trim() }
                  : currentTodo,
              ),
            );
            setIsEditing(false);
          })
          .catch(() => setErrorMessage(Errors.onUpdate))
          .finally(() => setEditedTodos([]));
      }
    }
  };

  const cancelChanges = () => {
    setIsEditing(false);
    setEditedTitle(title);
  };

  const handlerKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelChanges();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          onChange={inputChangesHandler}
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status', {
            completed,
          })}
          checked={completed}
        />
      </label>

      {isEditing ? (
        <form onSubmit={onSubmitChanges}>
          <input
            onKeyUp={handlerKeyUp}
            ref={titleField}
            onBlur={onSubmitChanges}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => setIsEditing(true)}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            onClick={clickHandler}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': editedTodos.includes(todo),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
