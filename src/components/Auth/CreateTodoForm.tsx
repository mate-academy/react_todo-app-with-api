import React, { useState } from 'react';
import { addTodo } from '../../api/todos';

export const CreateTodoForm: React.FC = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  // console.log(isSubmit);

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      if (isSubmit) {
        addTodo({
          userId: 1,
          title: todoTitle,
          completed: false,
        });
      }

      setTodoTitle('');
    }}
    >
      <input
        value={todoTitle}
        data-cy="NewTodoField"
        type="text"
        // ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={event => setTodoTitle(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            setIsSubmit(true);
          }
        }}

      />
    </form>
  );
};
