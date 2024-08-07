import * as React from 'react';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { usePostTodos } from '../../hooks/usePostTodos';
import { useTodos } from '../../utils/TodoContext';
import { useToggleTodoStatus } from '../../hooks/useToggleTodoStatus';
import { ErrorType } from '../../types/ErrorType';

export const TodoContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [input, setInput] = useState('');
  const { postTodo, error, clearError, isSubmitting } = usePostTodos();
  const { todos, setError, inputRef, triggerFocus } = useTodos();
  const { toggleTodoStatus } = useToggleTodoStatus();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postTodo(input).then(success => {
      if (success) {
        setInput('');
        triggerFocus();
      }
    });
  };

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = async () => {
    const newCompletedStatus = !allTodosCompleted;
    const togglePromises = todos.map(todo => {
      if (todo.completed !== newCompletedStatus) {
        return toggleTodoStatus(todo.id, newCompletedStatus);
      }

      return Promise.resolve(true);
    });

    const results = await Promise.all(togglePromises);

    if (results.some(result => !result)) {
      setError(ErrorType.UnableToUpdateTodo);
    }
  };

  useEffect(() => {
    if (error) {
      setError(error);
      triggerFocus();
    }

    return () => {
      clearError();
    };
  }, [error, setError, triggerFocus, clearError]);

  return (
    <>
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={`todoapp__toggle-all ${allTodosCompleted ? 'active' : ''}`}
              onClick={handleToggleAll}
            ></button>
          )}
          <form onSubmit={onFormSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={input}
              onChange={handleInputChange}
              disabled={isSubmitting}
              autoFocus
            />
          </form>
        </header>
        {children}
      </div>
    </>
  );
};
