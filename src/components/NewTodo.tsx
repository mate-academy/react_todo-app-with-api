/* eslint-disable react/display-name */
import React, { useRef, useEffect, memo } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  currentTodoList: Todo[];
  handleCreateTodo: ({
    title,
    userId,
    completed,
  }: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (arg: string) => void;
  isInputDisabled: boolean;
  inputValue: string;
  setInputValue: (arg: string) => void;
  updateTodo: (todo: Todo) => Promise<void>;
}

export const NewTodo: React.FC<Props> = memo(
  ({
    currentTodoList,
    handleCreateTodo,
    setErrorMessage,
    isInputDisabled,
    inputValue,
    setInputValue,
    updateTodo,
  }: Props) => {
    const allTodosAreCompleted = currentTodoList.every(todo => todo.completed);

    const inputAutoFocus = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputAutoFocus.current) {
        inputAutoFocus.current.focus();
      }
    }, [isInputDisabled]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const valueForTodo = inputValue.trim();

      if (!valueForTodo) {
        setErrorMessage('Title should not be empty');

        return;
      }

      handleCreateTodo({
        title: valueForTodo,
        userId: 2500,
        completed: false,
      });
    };

    const handleToggleAllTodos = async () => {
      currentTodoList.forEach(async todo => {
        if (allTodosAreCompleted) {
          try {
            const newTodo = { ...todo, completed: !todo.completed };

            await updateTodo(newTodo);
          } catch (error) {}
        } else if (!todo.completed) {
          try {
            const newTodo = { ...todo, completed: true };

            await updateTodo(newTodo);
          } catch (error) {}
        }
      });
    };

    return (
      <header className="todoapp__header">
        {currentTodoList[0] && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              // eslint-disable-next-line prettier/prettier
              'active': allTodosAreCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={handleToggleAllTodos}
          />
        )}

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={handleInputChange}
            ref={inputAutoFocus}
            disabled={isInputDisabled}
          />
        </form>
      </header>
    );
  },
);
