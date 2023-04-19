import React from 'react';

type Props = {
  query: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onHandleTitleChange: () => void;
  onSetQuery: (value: string) => void;
  onHandleBlur: () => void;
};

export const InputForm: React.FC<Props> = ({
  query,
  inputRef,
  onHandleTitleChange,
  onSetQuery,
  onHandleBlur,
}) => {
  return (
    <form onSubmit={onHandleTitleChange}>
      <input
        type="text"
        className="todo__title-field"
        ref={inputRef}
        value={query}
        onChange={(event) => onSetQuery(event.target.value)}
        onBlur={onHandleBlur}
      />
    </form>
  );
};
