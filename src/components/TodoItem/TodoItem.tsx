import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { TodosContext } from '../../utils/TodosContext';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorContext } from '../../utils/ErrorContextProvider';
import { Errors } from '../../types/Errors';

type Props = {
  isLoading: boolean,
  title: string,
  completed: boolean,
  id: number,
};

export const TodoItem: React.FC<Props> = React.memo(({
  title,
  completed,
  isLoading,
  id,
}) => {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const { setTodos } = useContext(TodosContext);
  const { showError } = useContext(ErrorContext);
  const { setProcessingTodos } = useContext(TodosContext);

  const todoInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && todoInput.current) {
      todoInput.current.focus();
    }
  }, [isEditing]);

  const deleteHandler = () => {
    setIsEditing(false);
    setProcessingTodos([id]);

    deleteTodo(id)
      .then(() => setTodos((todos) => todos.filter(todo => todo.id !== id)))
      .catch(() => showError(Errors.Delete));
  };

  const checkHandler = () => {
    setProcessingTodos([id]);

    updateTodo(id, { completed: !completed })
      .then(() => setTodos((todos) => {
        return todos.map(todo => {
          if (todo.id === id) {
            return { ...todo, completed: !completed };
          }

          return todo;
        });
      }))
      .catch(() => showError(Errors.Update))
      .finally(() => setProcessingTodos([]));
  };

  const changeTitleHandler = () => {
    setIsEditing(false);
    setProcessingTodos([id]);

    if (currentTitle.length === 0) {
      deleteHandler();
    }

    updateTodo(id, { title: currentTitle })
      .then(() => setTodos((todos) => {
        return todos.map(todo => {
          if (todo.id === id) {
            return { ...todo, title: currentTitle };
          }

          return todo;
        });
      }))
      .catch(() => showError(Errors.Update))
      .finally(() => setProcessingTodos([]));
  };

  const editingSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    changeTitleHandler();
  };

  const escapeHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={checkHandler}
        />
      </label>

      {isEditing ? (
        <form onSubmit={editingSubmitHandler}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            onBlur={changeTitleHandler}
            onKeyUp={escapeHandler}
            ref={todoInput}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={deleteHandler}
          >
            ×
          </button>
        </>
      )}

      <div className={cn('modal overlay', { 'is-active': isLoading })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
