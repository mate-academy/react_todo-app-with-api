import React, { useState } from 'react';

type Props = {
  addTodo
}

export const TodoCreate: React.FC<Props> = ({ addTodo }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      addTodo();
    }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        value={todoTitle}
        onChange={(event) => setTodoTitle(event.target.value)}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            setIsSubmit(true);
          }
        }}

      />
    </form>
  );
};
