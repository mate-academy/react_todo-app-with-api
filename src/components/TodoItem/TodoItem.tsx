/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  updateTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (todo: Todo) => void;
  loadingTodos: Todo[];
  setLoadingTodos: (todo: Todo) => void;
  edit: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updateTodo,
  deleteTodo,
  loadingTodos,
  setLoadingTodos,
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [tempTitle, setTempTitle] = useState(todo.title);
  const titleField = useRef<HTMLInputElement>(null);

  const handleIsCompleted = (paramTodo: Todo) => {
    setLoadingTodos(todo);
    const newTodo = { ...paramTodo, completed: !paramTodo.completed };

    updateTodo(newTodo);
  };

  const handleDeleteButton = () => {
    setLoadingTodos(todo);
    deleteTodo(todo);
  };

  const handleTempTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTempTitle(event.target.value);
  };

  // const successUpdateState = () => {
  //   setIsEdited(false);
  // };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!tempTitle.trim()) {
      setLoadingTodos(todo);
      deleteTodo(todo);

      return;
    }

    if (todo.title === tempTitle) {
      setIsEdited(false);
    }

    if (todo.title !== tempTitle.trim()) {
      setLoadingTodos(todo);

      const newTodo = { ...todo, title: tempTitle.trim() };

      // setIsEdited(true);

      updateTodo(newTodo)
        .then(() => {
          setIsEdited(false);
        })
        .catch(() => {
          setIsEdited(true);
        });
    }
  };

  const handleOnEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setIsEdited(false);
    }
  };

  const handleDoubleClick = () => {
    setIsEdited(true);
  };

  const handleOnBlur = () => {
    if (todo.title === tempTitle) {
      setIsEdited(false);
    }

    if (!tempTitle.trim()) {
      deleteTodo(todo);

      return;
    }

    if (todo.title !== tempTitle.trim()) {
      setLoadingTodos(todo);

      const newTodo = { ...todo, title: tempTitle.trim() };

      setIsEdited(true);

      updateTodo(newTodo)
        .then(() => {
          setIsEdited(false);
        })
        .catch(() => {
          setIsEdited(true);
        });
    }
  };

  useEffect(() => {
    if (!todo.id || loadingTodos.includes(todo)) {
      titleField.current?.focus();
    }
  }, [todo, loadingTodos]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleIsCompleted(todo)}
        />
      </label>
      {!isEdited ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteButton}
          >
            ×
          </button>
        </>
      ) : (
        // {/* This form is shown instead of the title and remove button */}
        <form onSubmit={handleFormSubmit}>
          <input
            name="title"
            value={tempTitle}
            autoFocus
            ref={titleField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={handleTempTitleChange}
            onBlur={handleOnBlur}
            onKeyUp={handleOnEsc}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        // className={classNames('modal overlay', {
        //   'is-active': !todo.id || tempArray.includes(todo),
        // })}
        className={classNames('modal overlay', {
          'is-active': !todo.id || loadingTodos.includes(todo),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
