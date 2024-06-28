import { useTodoApi, useTodoTodos } from './Context';
import React, { useEffect, useRef, useState } from 'react';

export const NewTodo: React.FC = () => {
  const { handleTodoAdd } = useTodoApi();
  const { tempTodo } = useTodoTodos();
  const [newTodoInput, setNewTodoInput] = useState('');
  const inputReference = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNewTodoInput(event.currentTarget.value);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleTodoAdd(newTodoInput).then(success => {
      if (success) {
        setNewTodoInput('');
      }
    });
  };

  useEffect(() => {
    inputReference.current?.focus();
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoInput}
        onChange={handleChange}
        disabled={!!tempTodo}
        ref={inputReference}
      />
    </form>
  );
};
