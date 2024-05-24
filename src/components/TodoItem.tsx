/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodos, updateTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  todo: Todo;
  isTemp: boolean;
  loadingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp,
  loadingIds,
  setTodos,
  setErrorMessage,
  setLoadingIds,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    if (editingTodo) {
      inputRef.current?.focus();
    }
  }, [editingTodo]);

  const handleDeleteClick = () => {
    setLoadingIds(prevIds => [...prevIds, todo.id]);

    deleteTodos(todo.id)
      .then(() =>
        setTodos((prevTodos: Todo[]) =>
          prevTodos.filter(todoItem => todoItem.id !== todo.id),
        ),
      )
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableDelete);
      })
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  };

  const handleCheck = () => {
    setLoadingIds(prevIds => [...prevIds, todo.id]);
    const updatedTodo = { ...todo, completed: !todo.completed };

    updateTodo(updatedTodo)
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(todoItem =>
            todoItem.id === todo.id ? updatedTodo : todoItem,
          ),
        );
      })
      .catch(() => setErrorMessage(ErrorMessage.UnableUpdate))
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  };

  const handleDoubleClick = () => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
  };

  const updateTodoTitle = () => {
    const normTitle = editTitle.trim();

    if (normTitle.length === 0) {
      handleDeleteClick();

      return;
    }

    if (normTitle === todo.title) {
      setEditingTodo(null);

      return;
    }

    setLoadingIds(prevIds => [...prevIds, todo.id]);

    const newTodo = { ...todo, title: normTitle };

    updateTodo(newTodo)
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(todoItem =>
            todoItem.id === todo.id ? newTodo : todoItem,
          ),
        );
      })
      .catch(() => setErrorMessage(ErrorMessage.UnableUpdate))
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    updateTodoTitle();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
      setEditTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed && 'completed'}`}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleCheck}
        />
      </label>

      {editingTodo === todo ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={updateTodoTitle}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteClick}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(isTemp || loadingIds.includes(todo.id)) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
