import './TodoHeader.scss';
import React, { useState } from 'react';
import { ErrorState } from '../../types/ErrorState';
import { createTodo, USER_ID } from '../../api/todos';
import { NewTodo } from '../../types/NewTodo';
import { Todo } from '../../types/Todo';
import clsx from 'clsx';
import { ErrorMessages } from '../../enums/ErrorMessages';

interface Props {
  todos: Todo[];
  userInput: string;
  onFieldChange: (value: string) => void;
  onError: (error: ErrorState) => void;
  onCreateTodo: (todo: Todo | null) => void;
  onCreateTodoSuccess: (todos: Todo[]) => void;
  onToggleAll: () => void;
  newTodoField: React.RefObject<HTMLInputElement>;
}

export const TodoHeader = ({
  todos,
  userInput,
  onFieldChange,
  onError,
  onCreateTodo,
  onCreateTodoSuccess,
  onToggleAll,
  newTodoField,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userInput.length === 0 || userInput.trim().length === 0) {
      onError({
        message: ErrorMessages.TitleEmpty,
        isVisible: true,
      });

      return;
    }

    setIsLoading(true);

    const normalizedInput = userInput.trim();

    const newTodo: NewTodo = {
      title: normalizedInput,
      userId: USER_ID,
      completed: false,
    };

    const tempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: normalizedInput,
      completed: false,
    };

    onCreateTodo(tempTodo);

    try {
      const createdTodo = (await createTodo(newTodo)) as Todo;

      onCreateTodoSuccess([...todos, createdTodo]);
      onFieldChange('');
    } catch {
      onError({
        message: ErrorMessages.AddTodo,
        isVisible: true,
      });

      setTimeout(() => {
        newTodoField.current?.focus();
      }, 0);
    } finally {
      onCreateTodo(null);
      setIsLoading(false);
    }
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={clsx('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          ref={newTodoField}
          onChange={handleFieldChange}
          value={userInput}
        />
      </form>
    </header>
  );
};
