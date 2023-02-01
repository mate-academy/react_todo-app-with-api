import React, { memo, useRef, useEffect } from 'react';

type Props = {
  newTodoField?: React.RefObject<HTMLInputElement>;
  title: string;
  isTodoAdding?: boolean;
  submitForm: (event?: React.FormEvent<HTMLFormElement>) => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  cancelUpdate: () => void;
};

export const TodoTitleField: React.FC<Props> = memo(({
  // newTodoField,
  title,
  isTodoAdding,
  submitForm,
  setTitle,
  cancelUpdate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCanceling = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (cancelUpdate && event.key === 'Escape') {
      cancelUpdate();
    }
  };

  return (
    <form onSubmit={submitForm}>
      <input
        data-cy="TodoTitleField"
        type="text"
        ref={inputRef}
        className="todo__title-field"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
        onBlur={() => submitForm()}
        disabled={isTodoAdding}
        onKeyDown={handleCanceling}
        tabIndex={0}
      />
    </form>
  );
});
