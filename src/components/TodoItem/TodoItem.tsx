import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodos } from '../../api/todos';
import { ErrorMessages } from '../../types/ErrorMessages';
import { Loader } from '../Loader/Loader';

type TodoItemProps = {
  todo: Todo;
  loading: number[];
  handleDeleteTodo: (todoId: number) => void;
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  setErrorMessage: (error: string) => void;
  setLoading: (
    loading: number[] | ((prevLoading: number[]) => number[]),
  ) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  handleDeleteTodo,
  setTodos,
  setErrorMessage,
  setLoading,
}) => {
  const [isChangeState, setIsChangeState] = useState(false);
  const [updateTodoTitle, setUpdateTodoTitle] = useState(todo.title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isChangeState) {
      input.current?.focus();
    }
  }, [isChangeState]);

  const handleToggleTodo = () => {
    setLoading(prev => [...prev, todo.id]);

    updateTodos(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todoItem =>
            todoItem.id === todo.id ? updatedTodo : todoItem,
          ),
        );
      })
      .catch(() => setErrorMessage(ErrorMessages.ToggleTodo))
      .finally(() => {
        setLoading(prev => prev.filter(id => id !== todo.id));
      });
  };

  const handleTodoDoubleClick = () => {
    setIsChangeState(true);
  };

  const changeTodo = () => {
    const trimmedTitle = updateTodoTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsChangeState(false);

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo(todo.id);
    } else {
      setIsSubmitting(true); // Indicate that a request is in progress
      setLoading(prev => [...prev, todo.id]);
      updateTodos(todo.id, { title: trimmedTitle })
        .then(updatedTodo => {
          setTodos(prevTodos =>
            prevTodos.map(todoItem =>
              todoItem.id === todo.id ? updatedTodo : todoItem,
            ),
          );
          setIsChangeState(false);
        })
        .catch(() => setErrorMessage(ErrorMessages.ToggleTodo))
        .finally(() => {
          setLoading(prev => prev.filter(id => id !== todo.id));
          setIsSubmitting(false); // Indicate that the request is complete
        });
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmitting) {
      // Only submit if not currently submitting
      changeTodo();
    }
  };

  const handleInputBlur = () => {
    if (!isSubmitting) {
      // Only change todo if not currently submitting
      changeTodo();
    }
  };

  const onEscPush = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setUpdateTodoTitle(todo.title);
      setIsChangeState(false);
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
          onChange={handleToggleTodo}
        />
      </label>

      {!isChangeState ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleTodoDoubleClick}
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
            ref={input}
            value={updateTodoTitle}
            onBlur={handleInputBlur}
            onKeyDown={onEscPush}
            onChange={event => setUpdateTodoTitle(event.target.value)}
          />
        </form>
      )}

      <Loader todo={todo} loading={loading} />
    </div>
  );
};
