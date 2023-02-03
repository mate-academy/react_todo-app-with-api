import React, { memo, useEffect } from 'react';

type Props = {
  newTodoField?: React.RefObject<HTMLInputElement>;
  title: string;
  isTodoAdding?: boolean;
  onSubmitForm: (event?: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: React.Dispatch<React.SetStateAction<string>>;
  cancelEditing?: () => void;
};

export const NewTodoField: React.FC<Props> = memo((props) => {
  const {
    newTodoField,
    title,
    isTodoAdding,
    onSubmitForm,
    onInputChange,
    cancelEditing,
  } = props;

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField) {
      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    }
  }, []);

  const handleEscPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (cancelEditing && event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <form onSubmit={onSubmitForm}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todo__title-field"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => onInputChange(event.currentTarget.value)}
        onBlur={() => onSubmitForm()}
        disabled={isTodoAdding}
        onKeyDown={handleEscPress}
        tabIndex={0}
      />
    </form>
  );
});
