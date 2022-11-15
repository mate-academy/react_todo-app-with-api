import React, { useEffect } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  handleQueryOfTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  queryOfTitle: string;
  handleOnSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
};

export const AddTodo: React.FC<Props> = ({
  newTodoField,
  handleQueryOfTitle,
  queryOfTitle,
  handleOnSubmit,
  isAdding,
}) => {
  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    // getTodosFromServer();
  }, [isAdding]);

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={queryOfTitle}
        onChange={handleQueryOfTitle}
        disabled={isAdding}
      />
    </form>
  );
};
