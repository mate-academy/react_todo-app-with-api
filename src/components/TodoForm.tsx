/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/UserId';

type Props = {
  loading: boolean,
  addTodo: (newTodo: Todo) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoForm: React.FC<Props> = ({
  loading,
  addTodo,
  setError,
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      setError('Unable to add a blank todo');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: value,
      completed: false,
    };

    addTodo(newTodo);
    setValue('');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          disabled={loading}
          onChange={(event) => setValue(event.target.value)}
        />
      </form>
    </>
  );
};
