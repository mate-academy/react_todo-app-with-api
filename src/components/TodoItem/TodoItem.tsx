import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { useTodo } from '../../hooks/useTodo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  loading?: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, loading }) => {
  const {
    todos,
    setTodos,
    setIsChecked,
    setErrorMessage,
    isProcessing,
    setIsProcessing,
  } = useTodo();
  const [title, setTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const [focus, setFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focus]);

  const updateSelectedTodo = (updatedTodo: Todo): void => {
    setIsProcessing(currentIds => [...currentIds, updatedTodo.id]);

    updateTodo(updatedTodo)
      .then(newTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(item => item.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.UPDATE_ERROR);
        throw error;
      })
      .finally(() => {
        setIsProcessing([]);
        setIsChecked(todos.every(item => item.completed));
      });
  };

  const checkTodo = (selectedTodo: Todo): void => {
    const updatedTodo = {
      ...selectedTodo,
      completed: !selectedTodo.completed,
    };

    updateSelectedTodo(updatedTodo);
  };

  const deleteSelectedTodo = (todoId: number): void => {
    setIsProcessing(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(curentTodos => curentTodos.filter(item => item.id !== todoId));
      })
      .catch((error) => {
        setTodos(todos);
        setErrorMessage(ErrorMessage.DELETE_ERROR);
        throw error;
      })
      .finally(() => setIsProcessing([]));
  };

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setFocus(true);
  }, [isEditing]);

  const handleBlur = () => {
    const newTitle = title.trim();

    if (!newTitle) {
      deleteSelectedTodo(todo.id);

      return;
    }

    if (newTitle === todo.title) {
      setTitle(todo.title);
      setIsEditing(false);
      setFocus(false);

      return;
    }

    const updatedTodo = {
      ...todo,
      title: newTitle,
    };

    updateSelectedTodo(updatedTodo);

    setTitle(newTitle);
    setIsEditing(false);
    setFocus(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitle(todo.title);
      setIsEditing(false);
      setFocus(false);
    }

    if (event.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => checkTodo(todo)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteSelectedTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={event => setTitle(event.target.value)}
            value={title}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': loading || isProcessing.includes(todo.id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
