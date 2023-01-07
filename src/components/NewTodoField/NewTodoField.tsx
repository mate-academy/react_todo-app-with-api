import React, { useEffect } from 'react';

type Props = {
  newTodoField?: React.RefObject<HTMLInputElement>;
  title: string;
  isAdding?: boolean;
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  cancelEditing?: () => void;
};

export const NewTodoField: React.FC<Props> = (props) => {
  const {
    newTodoField,
    title,
    isAdding,
    onSubmit,
    onChange,
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
    if (cancelEditing) {
      if (event.key === 'Escape') {
        cancelEditing();
      }
    }
  };

  return (
    <form onSubmit={event => onSubmit(event)}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => onChange(event.currentTarget.value)}
        onBlur={() => onSubmit()}
        disabled={isAdding}
        onKeyDown={(event) => handleEscPress(event)}
        tabIndex={0}
      />
    </form>
  );
};
