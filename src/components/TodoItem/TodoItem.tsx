import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessages';
import { Loader } from '../Loader/Loader';

type TodoItemProps = {
  todo: Todo;
  loading: number[];
  handleDeleteTodo: (todoId: number) => void;
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  setErrorNotification: (error: string) => void;
  setLoading: (
    loading: number[] | ((prevLoading: number[]) => number[]),
  ) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  handleDeleteTodo,
  setTodos,
  setErrorNotification,
  setLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const toggleTodoStatus = () => {
    setLoading(prevLoading => [...prevLoading, todo.id]);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(item => (item.id === todo.id ? updatedTodo : item)),
        );
      })
      .catch(() => setErrorNotification(ErrorMessage.ToggleTodo))
      .finally(() => {
        setLoading(prevLoading => prevLoading.filter(id => id !== todo.id));
      });
  };

  const initiateEditing = () => {
    setIsEditing(true);
  };

  const saveTodo = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo(todo.id);
    } else {
      setIsProcessing(true);
      setLoading(prevLoading => [...prevLoading, todo.id]);
      updateTodo(todo.id, { title: trimmedTitle })
        .then(updatedTodo => {
          setTodos(prevTodos =>
            prevTodos.map(item => (item.id === todo.id ? updatedTodo : item)),
          );
          setIsEditing(false);
        })
        .catch(() => setErrorNotification(ErrorMessage.ToggleTodo))
        .finally(() => {
          setLoading(prevLoading => prevLoading.filter(id => id !== todo.id));
          setIsProcessing(false);
        });
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isProcessing) {
      saveTodo();
    }
  };

  const handleBlur = () => {
    if (!isProcessing) {
      saveTodo();
    }
  };

  const handleEscapeKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleTodoStatus}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={initiateEditing}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <input
            className="todo__title-field"
            data-cy="TodoTitleField"
            ref={inputRef}
            value={newTitle}
            onBlur={handleBlur}
            onKeyDown={handleEscapeKey}
            onChange={event => setNewTitle(event.target.value)}
          />
        </form>
      )}

      <Loader todo={todo} loading={loading} />
    </div>
  );
};
