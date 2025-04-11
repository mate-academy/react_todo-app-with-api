import React from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';

type Props = {
  handleAddTodo: (newTodo: Todo) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setInputValue: (inputValue: string) => void;
  inputValue: string;
};

export const SubmitForm: React.FC<Props> = ({
  handleAddTodo,
  inputRef,
  setInputValue,
  inputValue,
}) => {
  const createTodo = () => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputValue.trim(),
      completed: false,
    };

    handleAddTodo(newTodo);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        createTodo();
      }}
    >
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={inputValue}
        onChange={event => setInputValue(event.target.value)}
      />
    </form>
  );
};
