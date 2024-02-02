import classNames from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../contexts/TodosContext';
import { deleteTodo, updateTodo } from '../../api/todos';

interface Props {
  todo: Todo
}

export const TodosItem: React.FC<Props> = ({ todo }) => {
  const {
    title,
    completed,
    id,
  } = todo;

  const {
    setTodos,
    setErrorMessage,
    changedTodos,
    setChangedTodos,
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

  const handlerClick = () => {
    setChangedTodos(currentTodos => [...currentTodos, todo]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(currentTodo => currentTodo.id !== id));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setChangedTodos([]));
  };

  const handlerInputChange = () => {
    setChangedTodos(currentTodos => [...currentTodos, todo]);

    updateTodo(todo)
      .then(() => setTodos(currentTodos => currentTodos
        .map(currentTodo => (currentTodo.id === id
          ? ({ ...currentTodo, completed: !completed })
          : currentTodo))))
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setChangedTodos([]));
  };

  const onSubmitChanges = (event: React.FormEvent) => {
    event.preventDefault();

    if (!editedTitle.trim()) {
      setChangedTodos(currentTodos => [...currentTodos, todo]);

      deleteTodo(id)
        .then(() => {
          setTodos(currentTodos => currentTodos
            .filter(currentTodo => currentTodo.id !== id));
        })
        .catch(() => setErrorMessage('Unable to delete a todo'))
        .finally(() => setChangedTodos([]));
    }

    if (editedTitle.trim()) {
      if (editedTitle === title) {
        setIsEditing(false);
      } else {
        setChangedTodos(currentTodos => [...currentTodos, todo]);

        updateTodo(todo)
          .then(() => {
            setTodos(currentTodos => currentTodos
              .map(currentTodo => (currentTodo.id === id
                ? ({ ...currentTodo, title: editedTitle.trim() })
                : currentTodo)));
            setIsEditing(false);
          })
          .catch(() => setErrorMessage('Unable to update a todo'))
          .finally(() => setChangedTodos([]));
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
    isEditing ? (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        {/* This form is shown instead of the title and remove button */}
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

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay',
            { 'is-active': changedTodos.includes(todo) })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    ) : (
      <div
        data-cy="Todo"
        className={classNames('todo', { completed })}
      >
        <label className="todo__status-label">
          <input
            onChange={handlerInputChange}
            data-cy="TodoStatus"
            type="checkbox"
            className={classNames('todo__status', { completed })}
            checked={completed}
          />
        </label>

        <span
          onDoubleClick={() => setIsEditing(true)}
          data-cy="TodoTitle"
          className="todo__title"
        >
          {todo.title}
        </span>

        {/* Remove button appears only on hover */}
        <button
          onClick={handlerClick}
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay',
            { 'is-active': changedTodos.includes(todo) })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )
  );
};
