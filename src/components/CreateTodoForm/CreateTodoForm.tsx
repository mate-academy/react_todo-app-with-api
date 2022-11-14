import React, { FC, useState } from 'react';

type Props = {
  addNewTodo: (title: string) => void;
  isTodoAdding: boolean;
};

export const CreateTodoForm: FC<Props> = ({ addNewTodo, isTodoAdding }) => {
  const [title, setTitle] = useState('');

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTitle('');
    await addNewTodo(title);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        disabled={isTodoAdding}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleChangeTitle}
      />
    </form>
  );
};
