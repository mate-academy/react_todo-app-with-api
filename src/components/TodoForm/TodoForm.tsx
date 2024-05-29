import React, { useEffect, useRef } from 'react';
import { useTodos } from '../context/TodosContext';
import { useError } from '../context/ErrorContext';
import { TodoError } from '../../types/enums';
import { USER_ID } from '../../utils/todos';

export const TodoForm: React.FC = () => {
  const { addTodo, setTempTodo, inputTodo, setInputTodo, isLoading } =
    useTodos();

  const { setErrorMessage } = useError();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSumbmitTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedInput = inputTodo.trim();

    if (!trimmedInput) {
      setErrorMessage(TodoError.NoTitle);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: trimmedInput,
      completed: false,
    };

    setTempTodo(newTodo);
    addTodo(newTodo);
  };

  return (
    <form onSubmit={handleSumbmitTodo}>
      <input
        aria-label="NewTodoField"
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputTodo}
        onChange={event => setInputTodo(event.target.value)}
        ref={inputRef}
        disabled={isLoading}
      />
    </form>
  );
};
