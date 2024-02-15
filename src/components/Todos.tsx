/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  newTodoTitle: string,
  setNewTodoTitle: (event: string) => void,
  allCompleted: boolean,
  toggleAll: () => void,
};

type InputProps = {
  value: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
};

const Input = React.memo<InputProps>(({ value, onChange }) => (
  <input
    type="text"
    className="todoapp__new-todo"
    placeholder="What needs to be done?"
    value={value}
    onChange={onChange}
  />
));

export const Todos: React.FC<Props> = ({
  onSubmit,
  newTodoTitle,
  setNewTodoTitle,
  allCompleted,
  toggleAll,
}) => {
  const toggleAllClassName = classNames(
    'todoapp__toggle-all', { active: allCompleted },
  );

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={toggleAllClassName}
        onClick={toggleAll}
      />

      <form onSubmit={onSubmit}>
        <Input
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
