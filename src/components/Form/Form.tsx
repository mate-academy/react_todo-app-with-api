import React, { FC } from 'react';

type Props = {
  handleAddTodo: () => void
  setTodoTitle: (title: string) => void;
  todoTitle: string
  activeInput: boolean;
};

export const Form: FC<Props> = React.memo(
  ({
    handleAddTodo,
    setTodoTitle,
    todoTitle,
    activeInput,
  }) => {
    const handleAddNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      handleAddTodo();
    };

    return (
      <form onSubmit={handleAddNewTodo}>
        <input
          type="text"
          disabled={!activeInput}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={({ target }) => setTodoTitle(target.value)}
        />

      </form>
    );
  },
);
