import React, { useEffect, useRef } from 'react';
import { useInput } from '../../utils/useInput';

type Props = {
  handleAddTodo: (titleNewTodo: string) => void;
  isAdding: boolean;
};

export const AddTodoForm: React.FC<Props> = React.memo(({
  handleAddTodo,
  isAdding,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const { value, onChange, clearInput } = useInput('');

  const submitAddingTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTitle = value.trim();

    handleAddTodo(newTitle);
    clearInput();
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  return (
    <form onSubmit={submitAddingTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={value}
        onChange={onChange}
        disabled={isAdding}
      />
    </form>
  );
});
