import { FormEventHandler, useRef } from 'react';

import { useTodos } from '../../contexts/todosContext';

export const TodoForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { handleAddTodo, isLoading } = useTodos();

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (inputRef.current) {
      const { value } = inputRef.current;

      handleAddTodo(value);
      inputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        disabled={isLoading}
        ref={inputRef}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"

      />
    </form>
  );
};
