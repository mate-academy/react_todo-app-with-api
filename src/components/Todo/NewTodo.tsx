import { useTodoApi, useTodoTodos } from './Context';
import React, { useEffect, useRef, useState } from 'react';

export const NewTodo: React.FC = () => {
  const { handleTodoAdd } = useTodoApi();
  const { todos, tempTodo } = useTodoTodos();
  const [newTodoInput, setNewTodoInput] = useState('');
  const inputReference = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNewTodoInput(event.currentTarget.value);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (await handleTodoAdd(newTodoInput)) {
      setNewTodoInput('');
    }
  };

  useEffect(() => {
    inputReference.current?.focus();
  }, [todos.length, tempTodo]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="NewTodoField"
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
