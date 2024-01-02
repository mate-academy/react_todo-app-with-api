import React, { useState, useRef, FormEvent } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodos, updateTodo } from '../api/todos';
import { useTodos } from '../context/TodosProvider';
import { ErrorMessage } from '../types/Errors';

type Props = {
  todo: Todo;
};

export const SingleTodo: React.FC<Props> = ({ todo }) => {
  const { title, completed, id } = todo;
  const {
    todos,
    setTodos,
    setErrorMessage,
  } = useTodos();
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputEditRef = useRef<HTMLInputElement | null>(null);

  const loaderClasses = cn(
    'modal',
    'overlay',
    { 'is-active': loading || id === 0 },
  );

  const handeleClickOnTodo = () => {
    setIsEditable(true);

    setTimeout(() => {
      inputEditRef.current?.focus();
    }, 0);
  };

  const handleDelete = () => {
    setLoading(true);
    deleteTodos(id)
      .then(() => {
        const filtered = todos.filter((post: Todo) => post.id !== id);

        setTodos(filtered);
      })
      .catch(() => setErrorMessage(ErrorMessage.Delete))
      .finally(() => setLoading(false));
  };

  const toggleCompleted = () => {
    setLoading(true);

    updateTodo(id, { completed: !completed })
      .then(updatedTodo => {
        const updatedTodos = todos.map(tod => (
          tod.id === id ? updatedTodo : tod));

        setTodos(updatedTodos);
      })
      .catch(() => setErrorMessage(ErrorMessage.Update))
      .finally(() => setLoading(false));
  };

  const handleBlur = () => {
    if (inputEditRef?.current?.defaultValue === inputEditRef?.current?.value) {
      setIsEditable(false);

      return;
    }

    if (inputEditRef?.current?.value === '') {
      handleDelete();

      return;
    }

    setLoading(true);

    updateTodo(id, {
      title: inputEditRef?.current?.value,
    })
      .then(data => {
        const copy = [...todos];
        const index = todos.findIndex(el => el.id === id);

        copy[index] = data;

        setTodos(copy);
      })
      .catch(() => setErrorMessage(ErrorMessage.Update))
      .finally(() => {
        setIsEditable(false);
        setLoading(false);
      });
  };

  const handleSaveTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleEditFieldKeyUp = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        inputEditRef.current?.blur();
        break;
      case 'Escape':
        setIsEditable(false);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn(completed
          ? 'todo completed'
          : 'todo')}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            onClick={toggleCompleted}
            className="todo__status"
            defaultChecked={completed}
          />
        </label>

        {isEditable ? (
          <form onSubmit={handleSaveTodo}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={title.trim()}
              onBlur={handleBlur}
              ref={inputEditRef}
              onKeyUp={handleEditFieldKeyUp}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handeleClickOnTodo}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDelete}
            >
              ×
            </button>
          </>
        )}
        <div
          data-cy="TodoLoader"
          className={loaderClasses}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
