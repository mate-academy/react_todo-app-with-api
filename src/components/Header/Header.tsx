import React from 'react';
import cn from 'classnames';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  title: string;
  isAdding: boolean;
  isAllTodosCompleted: boolean;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void;
  onUpdateAll: () => void;
};

export const Header: React.FC<Props> = (props) => {
  const {
    newTodoField,
    title,
    isAdding,
    isAllTodosCompleted,
    onChange,
    onSubmitForm,
    onUpdateAll,
  } = props;

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isAllTodosCompleted },
        )}
        onClick={() => onUpdateAll()}
      />

      <form onSubmit={event => onSubmitForm(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => onChange(event.currentTarget.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
