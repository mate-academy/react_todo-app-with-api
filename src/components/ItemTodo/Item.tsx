import classNames from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { ErrorMessage, Todo } from '../../types';
import { ContextTodo } from '../ContextTodo';
import { deleteTodo, updateTodo } from '../../api/todos';

interface Props {
  todo: Todo
}

export const ItemTodo: React.FC<Props> = ({ todo }) => {
  const {
    title,
    completed,
    id,
  } = todo;

  const {
    setTodos,
    errorMessage,
    setErrorMessage,
    loadingTodoIds,
    setLoadingTodoIds,
  } = useContext(ContextTodo);

  const [editedTitle, setEditedTitle] = useState(title); // зберігається title
  const [isEditing, setIsEditing] = useState(false); // статус зміни title

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isEditing, errorMessage]);

  const deleteHandler = () => {
    setLoadingTodoIds(currentId => [...currentId, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(currentTodo => currentTodo.id !== id));
      })
      .catch(() => setErrorMessage(ErrorMessage.DeleteTodoError))
      .finally(() => setLoadingTodoIds([]));
  };

  const inputChangeHandler = () => {
    setLoadingTodoIds(currentId => [...currentId, id]);

    updateTodo({ id, completed: !completed, title })
      .then((responce) => {
        if (responce) {
          setTodos(currentTodos => currentTodos
            .map(currentTodo => (currentTodo.id === id
              ? ({ ...currentTodo, completed: !completed })
              : currentTodo)));
        }
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UpdateTodoError);
      })
      .finally(() => setLoadingTodoIds([]));
  };

  const onSubmitChanges = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedTitle.trim()) {
      deleteHandler();
    }

    if (editedTitle.trim()) {
      if (editedTitle === title) {
        setIsEditing(false);
      } else {
        setLoadingTodoIds(currentId => [...currentId, id]);

        updateTodo({ completed, id, title: editedTitle })
          .then(() => {
            setTodos(currentTodos => currentTodos
              .map(currentTodo => (currentTodo.id === id
                ? ({ ...currentTodo, title: editedTitle.trim() })
                : currentTodo)));
            setIsEditing(false);
          })
          .catch(() => setErrorMessage(ErrorMessage.UpdateTodoError))
          .finally(() => setLoadingTodoIds([]));
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
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          onChange={inputChangeHandler}
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status', { completed })}
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
            onChange={(event) => setEditedTitle(event.target.value)}
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
            onClick={deleteHandler}
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
        className={classNames('modal overlay',
          { 'is-active': loadingTodoIds.includes(id) })}
      // { 'is-active': editedTodos.includes(todo) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
