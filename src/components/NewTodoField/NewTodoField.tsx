import React, { memo, useEffect } from 'react';

type Props = {
  newTodoField?: React.RefObject<HTMLInputElement>;
  title: string;
  isAdding?: boolean,
  submitForm: (event?: React.FormEvent<HTMLFormElement>) => void;
  changeInput: React.Dispatch<React.SetStateAction<string>>;
  cancelEditing?: () => void;
};

export const NewTodoField: React.FC<Props> = memo((props) => {
  const {
    newTodoField,
    title,
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
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => changeInput(event.currentTarget.value)}
        onBlur={() => submitForm()}
        disabled={isAdding}
        onKeyDown={handleEscPress}
        tabIndex={0}
      />
    </form>
  );
});
