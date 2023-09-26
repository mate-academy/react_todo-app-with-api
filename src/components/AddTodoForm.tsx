/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../types/types';
import { USER_ID } from '../constants/constants';

type Props = {
  loading: boolean,
  addTodo: (newTodo: Todo) => void;
  onFail: React.Dispatch<React.SetStateAction<string>>;
};

export const AddTodoForm: React.FC<Props> = ({
  loading,
  addTodo,
  onFail,
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      onFail('Unable to add a blank todo');

      return;
    }

    const newTodo = {
      userId: USER_ID,
      id: 0,
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
