import React, { useEffect, useRef, useState } from 'react';

type Props = {
  initialTitle: string;
  onSave: (newTitle: string) => void;
  onCancel: () => void;
};

export const TodoEditField: React.FC<Props> = ({
  initialTitle,
  onSave,
  onCancel,
}) => {
  const [value, setValue] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();

    onSave(trimmed);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      data-cy="TodoTitleField"
      type="text"
      className="todo__title-field"
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={handleSubmit}
      onKeyUp={handleKeyUp}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit();
        }
      }}
    />
  );
};
