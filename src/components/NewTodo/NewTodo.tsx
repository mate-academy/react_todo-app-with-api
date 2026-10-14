import React from 'react';

type NewTodoProps = {
  newTodoTitle: string;
  onTitleChange: (title: string) => void;
  onSubmit: () => void;
  newTodoField: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
};

export const NewTodo: React.FC<NewTodoProps> = ({
  newTodoTitle,
  onTitleChange,
  onSubmit,
  newTodoField,
  isAdding,
}) => {
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        ref={newTodoField}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={newTodoTitle}
        onChange={event => onTitleChange(event.target.value)}
        disabled={isAdding}
      />
    </form>
  );
};
