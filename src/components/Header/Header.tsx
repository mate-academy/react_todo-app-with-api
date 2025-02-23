import React, { useState, useRef, useEffect } from 'react';
import { addTodos, USER_ID, updateTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

type HeaderProps = {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  setErrorMessage: (error: string) => void;
  setTemporaryTodo: (todo: Todo | null) => void;
  loadingTodos: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  todos,
  setTodos,
  setErrorMessage,
  setTemporaryTodo,
  loadingTodos,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage(ErrorMessages.EmptyTitle);

      return;
    }

    setIsSubmitting(true);
    const newTodo = {
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTemporaryTodo({ id: 0, ...newTodo });
    addTodos(newTodo)
      .then(todo => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(ErrorMessages.AddTodo))
      .finally(() => {
        setTemporaryTodo(null);
        setIsSubmitting(false);
        inputRef.current?.focus();
      });
  };

  const toggleAllTodos = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newCompletedStatus = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    const updatedTodos = todos.map(todo => {
      if (todosToUpdate.some(todoToUpdate => todoToUpdate.id === todo.id)) {
        const updatedTodo = { ...todo, completed: newCompletedStatus };

        updateTodos(updatedTodo.id, { completed: updatedTodo.completed })
          .then(() => {
            setTodos(prevTodos =>
              prevTodos.map(todoItem =>
                todoItem.id === updatedTodo.id ? updatedTodo : todoItem,
              ),
            );
          })
          .catch(() => setErrorMessage(ErrorMessages.ToggleTodo));

        return updatedTodo;
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  return (
    <header className="todoapp__header">
      {!loadingTodos && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
