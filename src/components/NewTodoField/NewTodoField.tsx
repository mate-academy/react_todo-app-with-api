import React, { memo, useEffect } from 'react';

type Props = {
  newTodoField?: React.RefObject<HTMLInputElement>;
  title: string;
  className: string,
  isAdding?: boolean,
  submitForm: (event?: React.FormEvent<HTMLFormElement>) => void;
  changeInput: React.Dispatch<React.SetStateAction<string>>;
  cancelEditing?: () => void;
};

export const NewTodoField: React.FC<Props> = memo((props) => {
  const {
    newTodoField,
    title,
    className,
    isAdding,
    submitForm,
    changeInput,
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
    <form onSubmit={submitForm}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className={className}
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => changeInput(event.currentTarget.value)}
        onBlur={() => submitForm()}
        disabled={isAdding}
        onKeyDown={handleEscPress}
      />
    </form>
  );
});
