import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  addNewTodo: (title: string) => void;
  tempTodo:Todo | null;
};

export const AddTodoForm:React.FC<Props> = ({
  addNewTodo,
  tempTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [hasTitleError, setHasTitleError] = useState(false);
  const isAddingTodo = Boolean(tempTodo);

  const handleInput = (event:React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const resetForm = () => {
    setTodoTitle('');
  };

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setHasTitleError(!todoTitle);

    if (!hasTitleError) {
      addNewTodo(todoTitle);

      resetForm();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      {isAddingTodo
        ? <Loader />
        : (
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={handleInput}
            disabled={isAddingTodo}
          />
        )}

    </form>
  );
};
