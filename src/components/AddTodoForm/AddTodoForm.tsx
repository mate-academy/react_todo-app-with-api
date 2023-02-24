import { useState } from 'react';

type Props = {
  addTodo: (title: string) => void;
  isInputDisabled: boolean;
};

export const AddTodoForm: React.FC<Props> = ({
  isInputDisabled,
  addTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTodoTitle(value);
  };

  const clearForm = () => {
    setTodoTitle('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();

    addTodo(trimmedTitle);
    clearForm();
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleInput}
        disabled={isInputDisabled}
      />
    </form>
  );
};
