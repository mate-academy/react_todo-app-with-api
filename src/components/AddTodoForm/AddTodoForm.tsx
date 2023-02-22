import React, { FormEvent, useCallback, useState } from 'react';

type Props = {
  handleAddTodo: (todoTitle: string) => void,
  inputDisabled: boolean,
};

export const AddTodoForm: React.FC<Props> = React.memo(({
  handleAddTodo, inputDisabled,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleInput = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;

    setTodoTitle(value);
  }, []);

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();

    handleAddTodo(todoTitle.trim());
    setTodoTitle('');
  }, [todoTitle]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleInput}
        disabled={inputDisabled}
      />
    </form>
  );
});
