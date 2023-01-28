import React, { memo, useEffect } from 'react';

type Props = {
  newTodoField?: React.RefObject<HTMLInputElement>;
  title: string;
  isTodoAdding?: boolean;
  submitForm: (event?: React.FormEvent<HTMLFormElement>) => void;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  cancelEditing?: () => void;
};

export const NewTodoField: React.FC<Props> = memo(({
  newTodoField,
  title,
  isTodoAdding,
  submitForm,
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
    <form onSubmit={submitForm}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setNewTitle(event.currentTarget.value)}
        onBlur={() => submitForm()}
        disabled={isTodoAdding}
        onKeyDown={handleEsc}
        tabIndex={0}
      />
    </form>
  );
});
