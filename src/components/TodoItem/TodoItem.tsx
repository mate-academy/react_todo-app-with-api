/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodos, updateTodos } from '../../helpers';
import { AppContext } from '../../wrappers/AppProvider';

export interface ITodoItem {
  todo: Todo;
}

export const TodoItem: FC<ITodoItem> = ({ todo }) => {
  const { setErrorType, setTodos, todoDeleteId, inputRef } =
    useContext(AppContext);

  const { id, title, completed } = todo;

  const [isDeleting, setIsDeleting] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [newTitle, setNewTitle] = useState(title);

  const inputRefd = useRef<HTMLInputElement>(null);

  const deletingThisTodo = todoDeleteId?.includes(todo.id);

  useEffect(() => {
    if (showForm) {
      inputRefd.current?.focus();
    }
  }, [showForm]);

  const onDoubleClick = () => {
    setShowForm(true);
  };

  const onDeleteClick = async () => {
    try {
      setIsDeleting(true);

      await deleteTodos(todo.id);

      setTodos(prevState => prevState.filter(el => el.id !== todo.id));
      inputRef.current?.focus();
    } catch (err) {
      setErrorType('delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const onCompletedClick = async () => {
    try {
      setIsDeleting(true);

      await updateTodos(id, {
        ...todo,
        completed: !completed,
      });

      setTodos(currentTodos =>
        currentTodos.map(currTodo => {
          if (currTodo.id === id) {
            return {
              ...currTodo,
              completed: !completed,
            };
          }

          return currTodo;
        }),
      );
    } catch (err) {
      setErrorType('update');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const trimmedTitle = newTitle.trimStart().trimEnd();

    setNewTitle(trimmedTitle);

    if (trimmedTitle === title) {
      setShowForm(false);

      return;
    }

    if (trimmedTitle === '') {
      await onDeleteClick();

      return;
    }

    try {
      setIsDeleting(true);

      await updateTodos(id, { ...todo, title: newTitle });

      setTodos(currentTodos =>
        currentTodos.map(currTodo => {
          if (currTodo.id === id) {
            return {
              ...currTodo,
              title: newTitle,
            };
          }

          return currTodo;
        }),
      );
      setShowForm(false);
    } catch (err) {
      setErrorType('update');
      inputRefd.current?.focus();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBlur = () => {
    const trimmedTitle = newTitle.trimStart().trimEnd();

    if (trimmedTitle !== title) {
      handleFormSubmit();
    } else {
      setShowForm(false);
      setNewTitle(trimmedTitle);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setShowForm(false);
      setNewTitle(title);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={onCompletedClick}
        />
      </label>
      {!showForm ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={onDoubleClick}
        >
          {title}
        </span>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            ref={inputRefd}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}
      {!showForm && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDeleteClick}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isDeleting || deletingThisTodo ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
