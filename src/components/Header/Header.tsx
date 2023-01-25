import React, { FC, memo, useState } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  createTodo: (title: string) => void;
  toggleAll: () => void;
};

export const Header: FC<Props> = memo((props) => {
  const {
    newTodoField,
    createTodo,
    toggleAll,
  } = props;

  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const onSubmit = () => {
    setIsAdding(true);
    createTodo(title);
    setTitle('');
    setIsAdding(false);
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        onClick={toggleAll}
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
