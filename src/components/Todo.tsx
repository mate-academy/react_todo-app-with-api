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
    tempTodo,
  } = useTodos();
  const [isEditable, setIsEditable] = useState(false);
  const [value, setValue] = useState(title);
  const inputEditRef = useRef<HTMLInputElement | null>(null);

  const handeleClickOnTodo = () => {
    setIsEditable(true);

    setTimeout(() => {
      inputEditRef.current?.focus();
    }, 0);
  };

  const handleDelete = () => {
    deleteTodos(id)
      .then(() => {
        setTimeout(() => {
          const filtered = todos.filter((post: Todo) => post.id !== id);

          setTodos(filtered);
        }, 500);
      })
      .catch(() => setErrorMessage(ErrorMessage.Delete));
  };

  const handleSaveTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateTodo(id, {
      title: inputEditRef?.current?.value,
    }).then(data => {
      const copy = [...todos];
      const index = todos.findIndex(el => el.id === id);

      copy[index] = data;

      setTodos(copy);
    }).catch(() => setErrorMessage(ErrorMessage.Update));
  };

  const toggleCompleted = () => {
    updateTodo(id, {
      completed: !completed,
    }).then(data => {
      const copy = [...todos];
      const index = todos.findIndex(el => el.id === id);

      copy[index] = data;

      setTodos(copy);
    }).catch(() => setErrorMessage(ErrorMessage.Update));
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
            className={cn(completed
              ? 'todo__status checked'
              : 'todo__status')}
            checked={completed}
          />
        </label>

        {isEditable ? (
          <form onSubmit={handleSaveTodo}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={value}
              onChange={e => setValue(e.target.value)}
              onBlur={() => setIsEditable(false)}
              ref={inputEditRef}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handeleClickOnTodo}
            >
              {title.trim()}
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
          className={cn('modal overlay', id === tempTodo?.id
            ? 'is-active'
            : '')}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
