import React, { useEffect, useState } from 'react';

type Props = {
  handleAddTodo: (titleNewTodo: string) => void;
  newTodoField: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
};

export const AddTodoForm: React.FC<Props> = React.memo(({
  handleAddTodo,
  newTodoField,
  isAdding,
}) => {
  const [titleNewTodo, setTitleNewTodo] = useState('');

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTitleNewTodo(event.target.value);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      const newTitle = titleNewTodo.trim();

      handleAddTodo(newTitle);
      setTitleNewTodo('');
    }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={titleNewTodo}
        onChange={event => handleInput(event)}
        disabled={isAdding}
      />
    </form>
  );
});
