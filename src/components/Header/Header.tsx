import React, { useState, useRef, useEffect } from 'react';
import { createTodo, USER_ID, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessages';

type HeaderProps = {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  setErrorNotification: (error: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  loadingTodos: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  todos,
  setTodos,
  setErrorNotification,
  setTempTodo,
  loadingTodos,
}) => {
  const [title, setTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorNotification(ErrorMessage.EmptyTitle);

      return;
    }

    setIsSubmitting(true);
    const newTodo = {
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({ id: 0, ...newTodo });
    createTodo(newTodo)
      .then(todo => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => setErrorNotification(ErrorMessage.AddTodo))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
        inputRef.current?.focus();
      });
  };

  const toggleAllTodos = async () => {
    setIsLoading(true);

    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    const updatedTodos = await Promise.all(
      todosToUpdate.map(async todo => {
        const updatedTodo = await updateTodo(todo.id, {
          completed: !todo.completed,
        });

        return updatedTodo;
      }),
    );

    setTodos(currentTodos =>
      currentTodos.map(
        todo => updatedTodos.find(updated => updated.id === todo.id) || todo,
      ),
    );

    setIsLoading(false);
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
          disabled={isLoading}
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
