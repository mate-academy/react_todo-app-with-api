import React, { memo } from 'react';
import cn from 'classnames';

type Props = {
  newTodoField?: React.RefObject<HTMLInputElement>;
  title: string;
  isTodoAdding: boolean;
  isAllTodosCompleted: boolean;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitForm: (event?: React.FormEvent<HTMLFormElement>) => void;
  onUpdateAllTodos: () => void;
};

export const Header: React.FC<Props> = memo((props) => {
  const {
    newTodoField,
    title,
    isTodoAdding,
    isAllTodosCompleted,
    setTitle,
    handleSubmitForm,
    onUpdateAllTodos,
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
        onClick={onUpdateAllTodos}
      />

      <form
        onSubmit={event => handleSubmitForm(event)}
      >
        <input
          disabled={isTodoAdding}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          data-cy="TodoTitleField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>

    </header>
  );
});
