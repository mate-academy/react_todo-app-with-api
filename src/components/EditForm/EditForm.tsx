import React, { useEffect, useRef } from 'react';

interface Props {
  isLoading: boolean;
  todoTitle: string;
  onTodoTitle: (arg: string) => void;
  submitButton: () => void;
}

export const EditForm: React.FC<Props> = ({
  isLoading,
  todoTitle,
  onTodoTitle,
  submitButton,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const handleSubmitButton = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitButton();
  };

  const onBlurHandler = () => {
    submitButton();
  };

  return (
    <form
      onSubmit={handleSubmitButton}
    >
      <input
        type="text"
        style={{ padding: '12px 0 12px 15px' }}
        ref={titleField}
        className="todoapp__new-todo"
        placeholder="Empty todo will be deleted"
        defaultValue={todoTitle}
        onBlur={onBlurHandler}
        onChange={(event) => onTodoTitle(event.target.value)}
        disabled={isLoading}
      />
    </form>
  );
};
