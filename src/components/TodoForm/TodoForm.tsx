import React, { useEffect, useRef, useState } from 'react';

interface Props {
  title: string;
  handleChangeTitle: (newTitle: string) => void;
  exitEditMode: () => void;
}

export const TodoForm: React.FC<Props> = ({
  title,
  handleChangeTitle,
  exitEditMode,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const inputReference = useRef<HTMLInputElement>(null);
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleChangeTitle(newTitle);
  };

  const handleCancelChange = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      exitEditMode();
    }
  };

  useEffect(() => {
    if (inputReference.current) {
      inputReference.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="todo__title-field"
        value={newTitle}
        onChange={handleTitleChange}
        onBlur={() => handleChangeTitle(newTitle)}
        onKeyUp={handleCancelChange}
        ref={inputReference}
      />
    </form>
  );
};
