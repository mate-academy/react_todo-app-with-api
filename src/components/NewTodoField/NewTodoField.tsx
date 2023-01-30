import React, { memo, useEffect } from 'react';

type Props = {
  newTodoField?: React.RefObject<HTMLInputElement>;
  newTitle: string;
  isTodoAdding?: boolean;
  updateTitle: (event?: React.FormEvent<HTMLFormElement>) => void;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  cancelEditing?: () => void;
};

export const NewTodoField: React.FC<Props> = memo(({
  newTodoField,
  newTitle,
  isTodoAdding,
  updateTitle,
  setNewTitle,
  cancelEditing,
}) => {
  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField) {
      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    }
  }, []);

  const handleEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (cancelEditing && event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <form onSubmit={updateTitle}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        onBlur={() => updateTitle()}
        disabled={isTodoAdding}
        onKeyDown={handleEsc}
        tabIndex={0}
      />
    </form>
  );
});
