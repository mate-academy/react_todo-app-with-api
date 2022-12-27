import React, { useEffect, useRef } from 'react';
import { useInput } from '../../utils/useInput';

type Props = {
  handleAddTodo: (titleNewTodo: string) => Promise<void>;
  isAdding: boolean;
  addError: (message: string) => void;
};

export const AddTodoForm: React.FC<Props> = React.memo(({
  handleAddTodo,
  isAdding,
  addError,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const { value, onChange, clearInput } = useInput('');

  const submitAddingTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTitle = value.trim();

    try {
      await handleAddTodo(newTitle);
      clearInput();
    } catch (error) {
      if (error instanceof Error) {
        addError(error.message);
      }
    }
  };

  useEffect(() => {
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
