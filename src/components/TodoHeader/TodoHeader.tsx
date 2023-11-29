import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import { AppDispatch, RootState } from '../../redux/store';
import {
  clearErrorType,
  clearTempTodo,
  hideError,
  setErrorType,
  setTempTodo,
} from '../../redux/todoSlice';
import { ErrorType } from '../../types/ErrorType';
import { addTodo, completeAllTodos } from '../../redux/todoThunks';

export const TodoHeader: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [inputValue, setInputValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorType = useSelector((state: RootState) => state.todos.errorType);
  const todos = useSelector((state: RootState) => state.todos.todos);
  const hasActiveTodos = todos.some(todo => !todo.completed);

  useEffect(() => {
    if (!inputValue && !isSubmitting) {
      inputRef.current?.focus();
    }
  }, [inputValue, isSubmitting]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = (title: string) => {
    if (!title) {
      dispatch(setErrorType(ErrorType.EmptyTitle));

      return;
    }

    setIsSubmitting(true);

    const newTempTodo = {
      id: 0,
      title,
      completed: false,
    };

    dispatch(setTempTodo(newTempTodo));

    dispatch(addTodo({ title }))
      .then(() => {
        dispatch(clearTempTodo());
        setInputValue('');
      })
      .catch(() => {
        dispatch(clearTempTodo());
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleFormSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    handleAddTodo(inputValue);

    if (errorType === ErrorType.EmptyTitle && inputValue) {
      setInputValue('');
      dispatch(hideError());
      dispatch(clearErrorType());
    }
  };

  const handleCompleteAll = () => {
    const shouldComplete = todos.some(todo => !todo.completed);

    if (!todos.length) {
      dispatch(setErrorType(ErrorType.CompleteAllTodosError));

      return;
    }

    dispatch(completeAllTodos({ todos, shouldComplete }));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: hasActiveTodos })}
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
        onClick={handleCompleteAll}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
