import React, { Ref } from 'react';

type Props = {
  activeInput: Ref<HTMLInputElement>;
  onCreate: () => void;
  titleNew: string;
  setTitleNew: (title: string) => void;
  isSubmitingNewTodo: boolean;
  allTodosCompleted: boolean;
  hasAnyTodo: boolean;
  makeToggleAll: () => void;
};

export const Form: React.FC<Props> = ({
  activeInput,
  onCreate,
  titleNew,
  setTitleNew,
  isSubmitingNewTodo,
  allTodosCompleted,
  hasAnyTodo,
  makeToggleAll,
}) => {
  const onAddNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    onCreate();
  };

  return (
    <header className="todoapp__header">
      {hasAnyTodo && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allTodosCompleted && 'active'}`}
          data-cy="ToggleAllButton"
          onClick={() => makeToggleAll()}
        />
      )}
      <form method="POST" onSubmit={onAddNewTodo}>
        <input
          disabled={isSubmitingNewTodo}
          ref={activeInput}
          value={titleNew}
          onChange={event => setTitleNew(event.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
