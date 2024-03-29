/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodos, editTodos } from '../api/todos';
import { SetTodosContext } from '../Contexts/TodosContext';
import { SetErrorContext } from '../Contexts/ErrorContext';
import { ErrorMessage } from '../types/Error';
import { SetInputRef } from '../Contexts/InputRefContext';
import { IsDeletingContext } from '../Contexts/DeletingContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const setTodos = useContext(SetTodosContext);
  const setErrorMessage = useContext(SetErrorContext);
  const setInputFocused = useContext(SetInputRef);
  const isDeleting = useContext(IsDeletingContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (todo.id === 0 || (todo.completed && isDeleting)) {
      setIsLoading(true);
    }
  }, [todo.id, isDeleting, todo.completed]);

  const handleTodoCheck = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    setIsLoading(true);

    editTodos(updatedTodo)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.map(prevTodo => {
            if (prevTodo.id === todo.id) {
              return updatedTodo;
            }

            return prevTodo;
          });
        });
      })
      .catch(() => setErrorMessage(ErrorMessage.update))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTodoDelete = useCallback(
    (todoId: number) => {
      setIsLoading(true);

      deleteTodos(todoId)
        .then(() => {
          setTodos(prevTodos => {
            return prevTodos.filter(prevTodo => prevTodo.id !== todoId);
          });
        })
        .catch(() => setErrorMessage(ErrorMessage.delete))
        .finally(() => {
          setIsLoading(false);
          setInputFocused(true);
        });
    },
    [setTodos, setErrorMessage, setInputFocused],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newTitle = query.trim();

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (newTitle === '') {
      handleTodoDelete(todo.id);

      return;
    }

    setIsLoading(true);

    const updatedTodo = { ...todo, title: newTitle };

    editTodos(updatedTodo)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.map(prevTodo => {
            if (prevTodo.id === todo.id) {
              return updatedTodo;
            }

            return prevTodo;
          });
        });
        setIsEditing(false);
      })
      .catch(() => setErrorMessage(ErrorMessage.update))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOnKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setQuery(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoCheck}
        />
      </label>

      {!isEditing ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={handleInputChange}
            ref={inputRef}
            onBlur={handleEditSubmit}
            onKeyUp={handleOnKeyUp}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
