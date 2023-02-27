import React from 'react';

type Props = {
  title: string,
  handleInput: (input: string) => void,
  handleAddTodo: (todoTitle: string) => void,
  isTitleDisabled: boolean,
};

export const TodoForm: React.FC<Props> = React.memo(({
  title,
  handleInput,
  handleAddTodo,
  isTitleDisabled,
}) => (
  <form
    onSubmit={(event) => {
      event.preventDefault();
      handleAddTodo(title);
    }}
  >
    <input
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      value={title}
      onChange={(event) => {
        handleInput(event.target.value);
      }}
      disabled={isTitleDisabled}
    />
  </form>
));
