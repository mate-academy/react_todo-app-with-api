/* eslint-disable import/no-extraneous-dependencies */
// src/components/NewTodo.tsx
import PropTypes from 'prop-types';
import React from 'react';
import { AddTodo, Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';

interface Props {
  handleAdd: (newTodo: AddTodo) => void;
  setErrorMessage: (msg: string) => void;
  tempTodo: Todo | null;
  setInputValue: (value: string) => void;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const NewTodo: React.FC<Props> = ({
  handleAdd,
  setErrorMessage,
  tempTodo,
  setInputValue,
  inputValue,
  inputRef,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = inputValue.trim();

    if (!trimmed) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: AddTodo = {
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    handleAdd(newTodo);
    setErrorMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={handleChange}
        ref={inputRef}
        disabled={!!tempTodo}
      />
    </form>
  );
};

NewTodo.propTypes = {
  handleAdd: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  tempTodo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    userId: PropTypes.number.isRequired,
  }),
  setInputValue: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  inputRef: PropTypes.any.isRequired,
};
